<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { OptionService } from '../../../service/OptionService';
  import { MobileUtils } from '../../../util/mobile/MobileUtils';
  import Hls from 'hls.js';
  import VideoInfoHeader from './video/VideoInfoHeader.svelte';
  import VideoInterface from './video/VideoInterface.svelte';
  import { WindowService } from '../../../service/WindowService';

  export let icon: string = '';
  export let url: string;
  export let title: string;

  const hls = new Hls();
  let paused: boolean;
  let muted: boolean;
  let videoElement: HTMLVideoElement;
  let interfaceShow = false;
  let volume: number = 100;
  $: videoVolume = MobileUtils.isMobile() ? 1 : volume / 100;

  const mountPlayer = (element: HTMLMediaElement, url: string) => {
    if (Hls.isSupported()) {
      hls.loadSource(url);
      hls.attachMedia(element);
    } else if (element.canPlayType('application/vnd.apple.mpegurl')) {
      element.src = url;
    }
  };

  onMount(() => {
    OptionService.volume.subscribe((it) => (volume = it));
    mountPlayer(videoElement, url);
    videoElement.play();
    console.log(111);
  });

  onDestroy(() => {});

  const videoBlur = () => {
    console.log('blur');
  };

  const onMouseWheel = (e: WheelEvent) => {
    const delta = Math.sign(e.deltaY) * 5;
    volume = clamp(volume - delta, 0, 100);
  };

  const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

  const toggleMute = () => {
    muted = !muted;
  };

  const requestFullScreen = () => {
    videoElement.requestFullscreen();
  };

  async function requestPip() {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else {
      await videoElement.requestPictureInPicture();
    }
  }

  const togglePause = () => {
    if (paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  };

  function onVolumeChange() {
    const volume = Math.round(videoElement.volume * 100);
    OptionService.setVolume(volume);
  }
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="root"
  on:wheel={(e) => onMouseWheel(e)}
  on:mouseover={(_) => (interfaceShow = true)}
  on:mouseout={(_) => (interfaceShow = false)}
  on:blur={videoBlur}
>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    id="video"
    src={url}
    bind:this={videoElement}
    bind:paused
    bind:muted
    bind:volume={videoVolume}
    on:volumechange={onVolumeChange}
  />

  {#if interfaceShow}
    <VideoInfoHeader {icon} {title} />
    <VideoInterface
      bind:volume
      {muted}
      {paused}
      onPlayPauseClick={togglePause}
      onPipClick={requestPip}
      onFullscreenClick={requestFullScreen}
      onMuteClick={toggleMute}
    />
  {/if}
</div>

<style lang="scss">
  .root {
    width: 100%;
    height: 100%;
    background-color: #000000;
    position: relative;

    video {
      width: 100%;
      height: 100%;
    }
  }
</style>
