<script lang="ts">
  import { onMount } from 'svelte';
  import { OptionService } from '../../../../service/OptionService';
  export let url: string;
  let root: HTMLElement;
  let video: HTMLVideoElement;
  let active = false;
  let name = '동영상';
  let duration = 0;
  let bytes = 0;
  let error = '';
  let dataSave = true;
  $: base = url.slice(0, -'watch'.length);
  function stop() {
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    active = false;
  }
  onMount(() => {
    const controller = new AbortController();
    const unsubscribe = OptionService.enableDataSave.subscribe((value) => (dataSave = value));
    fetch(base + 'info', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('보관 기간이 만료되었거나 영상을 불러올 수 없습니다.');
        const info = await response.json();
        name = info.name;
        duration = info.duration;
        bytes = info.bytes;
      })
      .catch((e) => {
        if (!controller.signal.aborted) error = e.message;
      });
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) stop();
    });
    observer.observe(root);
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener('visibilitychange', hide);
    return () => {
      unsubscribe();
      controller.abort();
      observer.disconnect();
      document.removeEventListener('visibilitychange', hide);
      stop();
    };
  });
</script>

<div class="uploaded-video" bind:this={root}>
  {#if active}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      bind:this={video}
      controls
      playsinline
      autoplay
      preload="none"
      src={base + 'file.mp4'}
      poster={base + 'poster.jpg'}
      on:pause={stop}
      on:error={() => {
        error = '영상을 재생할 수 없습니다.';
        stop();
      }}
    />
  {:else}
    <button
      type="button"
      class="play"
      on:click|stopPropagation={() => (active = true)}
      aria-label={name + ' 재생'}
    >
      {#if !dataSave}<img src={base + 'poster.jpg'} alt="" loading="lazy" />{/if}
      <span>▶ 재생</span>
    </button>
  {/if}
  <div class="caption">{name} · {Math.ceil(duration)}초 · {(bytes / 1048576).toFixed(1)} MB</div>
  {#if error}<p role="status">{error}</p>{/if}
</div>

<style>
  .uploaded-video {
    width: 320px;
    max-width: 100%;
    margin: 5px 0;
    border-radius: 4px;
    overflow: hidden;
    background: var(--primary-hoverground-color);
  }
  video,
  .play {
    display: block;
    width: 100%;
    aspect-ratio: 16/9;
    background: #111;
  }
  .play {
    position: relative;
    border: 0;
    padding: 0;
    color: white;
    cursor: pointer;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .play span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #222c;
    padding: 8px 16px;
    border-radius: 5px;
  }
  .caption,
  p {
    padding: 6px 8px;
    font-size: 12px;
    overflow-wrap: anywhere;
    margin: 0;
  }
</style>
