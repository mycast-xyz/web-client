<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { ModifyStreamCommand } from '../../model/stream/ModifyStreamCommand';
  import { ProfileService } from '../../service/ProfileService';
  import { SessionService } from '../../service/SessionService';
  import { WindowService } from '../../service/WindowService';
  import InlineSvg from '../../view-framework/InlineSvg.svelte';
  import SettingModal from './SettingModal.svelte';
  import ExternalStreamSettingForm from './stream/ExternalStreamSettingForm.svelte';
  import LocalStreamSettingForm from './stream/LocalStreamSettingForm.svelte';

  const platforms = [
    {
      id: 'local',
      icon: 'mycast',
      title: '로컬서버'
    },
    // {
    //   id: 'totoro',
    //   icon: 'totoro',
    //   title: '이웃서버'
    // },
    {
      id: 'twitch',
      icon: 'twitch',
      title: '트위치'
    },
    {
      id: 'afreeca',
      icon: 'afreecatv',
      title: '아프리카TV'
    },
    {
      id: 'youtube',
      icon: 'youtube',
      title: '유튜브'
    }
  ];
  let currentPlatformId = 'local';
  let localId = get(ProfileService.localId);
  let afreecaId = get(ProfileService.afreecaId);
  let twitchId = get(ProfileService.twitchId);
  let youtubeHandle = get(ProfileService.youtubeHandle);
  let youtubeVideoId = get(ProfileService.youtubeVideoId);

  onMount(() => {
    ProfileService.platform.subscribe((v) => (currentPlatformId = v));
    ProfileService.localId.subscribe((v) => (localId = v));
    ProfileService.afreecaId.subscribe((v) => (afreecaId = v));
    ProfileService.twitchId.subscribe((v) => (twitchId = v));
    ProfileService.youtubeHandle.subscribe((v) => (youtubeHandle = v));
    ProfileService.youtubeVideoId.subscribe((v) => (youtubeVideoId = v));
  });

  function onSubmitClick() {
    const privateKey = SessionService.getPrivateKey();
    new ModifyStreamCommand().execute(
      privateKey,
      currentPlatformId,
      '',
      afreecaId,
      twitchId,
      '',
      youtubeHandle,
      youtubeVideoId
    );
    ProfileService.afreecaId.set(afreecaId);
    ProfileService.twitchId.set(twitchId);
    ProfileService.youtubeHandle.set(youtubeHandle);
    ProfileService.youtubeVideoId.set(youtubeVideoId);
    ProfileService.platform.set(currentPlatformId);
    WindowService.closeModal();
  }
</script>

<SettingModal title="방송 설정" icon="fas fa-podcast">
  <div slot="body" class="stream-setup">
    <div class="stream-btn">
      {#each platforms as p}
        <button
          name="stream-live-select"
          class="live-select"
          class:active={p.id === currentPlatformId}
          on:click={(_) => (currentPlatformId = p.id)}
        >
          <!-- SVG 변경 필수 -->
          <div class="icon">
            <InlineSvg src="/assets/image/stream/{p.icon}.svg" />
          </div>
          <h3>{p.title}</h3>
        </button>
      {/each}
    </div>

    <div class="stream-form">
      {#if currentPlatformId === 'local'}
        <LocalStreamSettingForm streamLink="rtmp://mycast.xyz/live" streamKey={localId} />
      {:else if currentPlatformId === 'totoro'}
        <LocalStreamSettingForm streamLink="rtmp://totoro.mycast.xyz/live" streamKey={localId} />
      {:else if currentPlatformId === 'afreeca'}
        <ExternalStreamSettingForm
          title="아프리카 아이디"
          subtitle="AFREECA ID"
          bind:streamKey={afreecaId}
        />
      {:else if currentPlatformId === 'twitch'}
        <ExternalStreamSettingForm
          title="트위치 아이디"
          subtitle="TWITCH ID"
          bind:streamKey={twitchId}
        />
      {:else if currentPlatformId === 'youtube' || currentPlatformId === 'youtube-private'}
        <ExternalStreamSettingForm
          bind:streamKey={youtubeHandle}
          title="유튜브 핸들"
          subtitle="YOUTUBE HANDLE"
        >
          <p slot="significant">
            <br />
            공개 방송용 Youtube Handle란입니다.
            <br />
            @를 포함한 핸들값이 필요합니다. ex. @abcde
            <br />
          </p>
        </ExternalStreamSettingForm>
        <ExternalStreamSettingForm
          bind:streamKey={youtubeVideoId}
          title="비디오 아이디"
          subtitle="VIDEO ID"
        >
          <p slot="significant">
            <br />
            비공개 방송을 위한 Video Id 항목입니다.
            <br />
            "watch?v="의 뒤에 값이 필요합니다.
            <br />
            <br />
            <b>해당 값은 생방송을 키고 확인 후 변경이 계속 필요합니다.</b>
          </p>
        </ExternalStreamSettingForm>
      {:else}
        <div />
      {/if}
      <button class="stream-sub" on:click={onSubmitClick}>
        <h2>방송 설정 저장</h2>
      </button>
    </div>
  </div>
</SettingModal>

<style lang="scss">
  .stream-setup {
    height: 778px;
    position: relative;

    .stream-btn {
      width: 100%;
      height: 140px;
      display: flex;
      border-bottom: 1px solid var(--primary-hoverground-color);
      margin-bottom: 15px;

      .live-select {
        width: 25%;
        height: 140px;
        padding: 10px 10px 10px 10px;

        text-align: center;
        border: 0px;
        border-radius: 0px;

        background-color: var(--primary-background-color);
        color: var(--primary-foreground-color);

        &:hover {
          background-color: var(--primary-hoverground-color);
        }
        &.active {
          background-color: var(--primary-activeground-color);
          color: var(--primary-activeground-font-color);
          .icon {
            fill: var(--primary-activeground-font-color);
          }
        }

        .icon {
          width: 60px;
          height: 60px;
          margin: 12px 22px;
          margin-bottom: 15px;
          fill: var(--primary-foreground-color);
        }
        h3 {
          font-size: 18px;
          letter-spacing: 1px;
        }
      }
    }
    .stream-form {
      width: calc(100% - 30px);
      height: calc(100% - 156px);
      padding: 0px 15px;
    }
    .stream-sub {
      width: 100%;
      height: auto;
      margin: 0px -15px;
      border: 0px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      padding: 20px 15px;
      background-color: var(--primary-activeground-color);
      color: var(--primary-activeground-font-color);

      position: absolute;
      bottom: 0px;
    }
  }
  // 모바일 처리
  @media (min-width: 320px) and (max-width: 500px) {
    .stream-setup {
      height: auto;
      .stream-btn {
        height: 107px;
        .live-select {
          height: 107px;
          .icon {
            width: calc(100% - 24px);
            height: auto;
            margin: 0px 12px;
            margin-bottom: 5px;
          }
          h3 {
            font-size: 14px;
            letter-spacing: 1px;
          }
        }
      }
      .stream-sub {
        position: fixed;
      }
    }
  }
</style>
