<script lang="ts">
  /**********************************************************
   * 해당 페이지는 미완성 페이지입니다.
   * 서비스에 해당 되는 부분이 미구현입니다.
   * 사용자의 데이터 값을 찾는 구간
   * 도네이션 체커가 미완성
   **********************************************************/
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { SessionService } from '../../service/SessionService';
  import { WindowService } from '../../service/WindowService';

  // 영상 도내 용 비디오 송출 타입
  type DonDefSet = {
    preview: boolean;
    videoLimit: number;
  };

  // 에러 송출용 타입
  type DonSendError = {
    userName: string;
    videoUrl: string;
    videoEndSe: string;
    videoStart: string;
  };

  // 영상 도네이션 보내기 타입
  type DonationVideoEntry = {
    // 도네이션 공통 처리
    recipientUserKey: string;
    senderUserKey: string;
    donationPrint: boolean;
    donationUserName: string;
    donationType: string;
    // 비디오 도네이션 단독 처리
    videoType: string;
    videoUrl: string;
    videoLimit: number;
    videoId: string;
    videoTitle: string;
    videoStart: number;
    videoDuration: number;
  };

  onMount(async () => {
    const donationVideoSetting = await getDonationVideoUse();
    DonDefSet.videoLimit = donationVideoSetting['video_limit'];
  });

  // 도네이션 비디오 송출
  let DonDefSet: DonDefSet = {
    videoLimit: 0,
    preview: false
  };

  // 결과 값 처리용
  let videoDonSet = {
    user_name: '',
    start: 0,
    limit: 10,
    url: '',
    urlId: '',
    urlTitle: '',
    duration: 0,
    urlChk: false
  };
  // 에러 송출용
  let error: DonSendError = {
    userName: '',
    videoUrl: '',
    videoEndSe: '',
    videoStart: ''
  };

  // 사용자 비디오 정보 표기용
  let videoViewRow: any;

  // 위젯 닫기용

  const close = () => {
    WindowService.closeModal();
  };

  // 사용자 비디오 도네이션 데이터 가져오기
  async function getDonationVideoUse(): Promise<any> {
    const privateKey = SessionService.getPrivateKey();
    const uri = `http://localhost:10030/setting/${privateKey}/video/data/all`;
    const { data: donationVideoSetting } = await axios.get(uri);

    console.log(donationVideoSetting.length);

    if (donationVideoSetting.length > 0) {
      return donationVideoSetting[0];
    } else {
      return null;
    }
  }

  // 닉네임 체커
  const donNameChk = (userName: string) => {
    let lenText = 0;
    for (var i = 0; i < userName.length; i++) {
      lenText++;
    }
    if (16 < lenText) {
      error.userName = '16자 까지 입력됩니다.';
    } else {
      error.userName = '';
    }
    return null;
  };

  /*
  유튜브 부분 시작
  */
  // 비디오 url 체커
  const donVideoUrlChk = async (url: string) => {
    // 유튜브 주소가 맞는지 체크
    const youtubeUrlTest = youtube_parser(videoDonSet.url);
    if (!youtubeUrlTest) {
      error.videoUrl = '정상적인 유튜브 주소가 아닙니다.';
      return false;
    }

    // 유튜브 주소값을 통해 프리뷰 떠오기
    videoDonSet.urlId = youtubeUrlTest;
    const videoRow: any = await getYoutubeShow(videoDonSet.urlId);
    if (videoRow.success) {
      videoDonSet.urlChk = true;
      DonDefSet.preview = true;
      videoViewRow = videoRow.youtubeRow;
      videoDonSet.urlTitle = videoViewRow.title.trim();
      let videoTime = videoRow.youtubeDuration;
      let videoMMSS = videoTime.replace('PT', '');
      let videoArr = videoMMSS.replace('S', '').split('M');
      videoDonSet.duration = Number(videoArr[0] * 60) + Number(videoArr[1]);
      error.videoUrl = '';
    } else {
      error.videoUrl = '정상적인 유튜브 주소가 아닙니다.';
    }
  };
  // 유튜브 체크
  function youtube_parser(url: string) {
    var urlRegex =
      /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
    var match = urlRegex.exec(url);
    return match ? match[1] : false;
  }
  // 유튜브 존재 여부 체크
  async function getYoutubeShow(urlid: string) {
    let youtubeRow: any = {};
    let youtubeChk = false;

    const uri = `http://localhost:10030/video/search/${urlid}`;
    const { data: videoData } = await axios.get(uri);

    if (videoData) {
      youtubeRow = videoData;
      youtubeRow.success = true;
      youtubeRow.youtubeDuration = videoData.youtubeDuration;
    } else {
      youtubeRow.success = false;
    }
    return youtubeRow;
  }
  /*
  유튜브 부분 종료
  */

  // 비디오 시간 체커
  const donVideoLimitChk = () => {
    let tmp_videoLimit = videoDonSet.limit;
    if (isNaN(tmp_videoLimit)) {
      error.videoEndSe = '숫자가 아닙니다.';
    } else {
      if (tmp_videoLimit > DonDefSet.videoLimit) {
        error.videoEndSe = DonDefSet.videoLimit + '이 최대 수 입니다.';
      } else if (tmp_videoLimit <= 0) {
        error.videoEndSe = '0보다 큰 수를 넣어주세요.';
      } else if (Number(videoDonSet.duration) - tmp_videoLimit < 0) {
        error.videoEndSe = '동영산 길이를 초과 합니다.';
      } else {
        error.videoEndSe = '';
      }
    }
  };

  // 비디오 시작 지점 체커
  const donVideoStartChk = () => {
    // 시간 & 시작 지점 tmp 생성
    let tmp_videoStart = videoDonSet.start;
    let tmp_videoLimit = videoDonSet.limit;
    // 시간 & 시작 지점 숫자 체커
    if (isNaN(tmp_videoStart)) {
      error.videoStart = '숫자가 아닙니다.';
    } else if (isNaN(tmp_videoLimit)) {
      error.videoEndSe = '숫자가 아닙니다.';
    } else {
      // 시작 지점이 동영상 길이 보다 긴가
      if (Number(videoDonSet.duration) < tmp_videoStart) {
        error.videoStart = '총합 ' + Number(videoDonSet.duration) + '초를 초과 합니다.';
        error.videoEndSe = '';
      } else if (Number(videoDonSet.duration) < tmp_videoLimit + tmp_videoStart) {
        error.videoEndSe = '총합 ' + Number(videoDonSet.duration) + '초를 초과 합니다.';
        error.videoStart = '총합 ' + Number(videoDonSet.duration) + '초를 초과 합니다.';
      } else if (tmp_videoStart < 0) {
        error.videoStart = '0보다 큰 수를 넣어주세요.';
      } else {
        error.videoStart = '';
      }
    }
  };

  const donVideoSub = async () => {
    // 시간 & 시작 지점 tmp 생성
    let tmp_videoStart = videoDonSet.start;
    let tmp_videoLimit = videoDonSet.limit;

    if (videoDonSet.user_name.length == 0) {
      error.userName = '닉네임을 설정해주세요.';
    } else if (videoDonSet.user_name.length > 16) {
      error.userName = '16자 까지 입력됩니다.';
    } else if (!videoDonSet.urlChk) {
      error.videoUrl = '정상적인 유튜브 주소가 아닙니다.';
    } else if (isNaN(tmp_videoStart)) {
      error.videoStart = '숫자가 아닙니다.';
    } else if (isNaN(tmp_videoLimit)) {
      error.videoEndSe = '숫자가 아닙니다.';
    } else if (tmp_videoLimit > videoDonSet.limit) {
      error.videoEndSe = videoDonSet.limit + '이 최대 수 입니다.';
    } else if (tmp_videoLimit <= 0) {
      error.videoEndSe = '0보다 큰 수를 넣어주세요.';
    } else if (tmp_videoStart < 0) {
      error.videoStart = '0보다 큰 수를 넣어주세요.';
    } else if (Number(videoDonSet.duration) - tmp_videoLimit < 0) {
      error.videoEndSe = '동영산 길이를 초과 합니다.';
    } else if (Number(videoDonSet.duration) < tmp_videoStart) {
      error.videoStart = '총합 ' + Number(videoDonSet.duration) + '초를 초과 합니다.';
    } else if (Number(videoDonSet.duration) < tmp_videoLimit + tmp_videoStart) {
      error.videoEndSe = '총합 ' + Number(videoDonSet.duration) + '초를 초과 합니다.';
      error.videoStart = '총합 ' + Number(videoDonSet.duration) + '초를 초과 합니다.';
    } else {
      const regex =
        /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      const videoTitle = videoDonSet.urlTitle.replace(regex, '');

      let videoDonData: DonationVideoEntry = {
        recipientUserKey: '받는 유저키',
        senderUserKey: '보내는 유저키',
        donationPrint: false,
        donationUserName: videoDonSet.user_name,
        donationType: 'video',
        videoType: 'youtube',
        videoUrl: videoDonSet.url,
        videoLimit: tmp_videoLimit,
        videoId: videoDonSet.urlId,
        videoTitle: videoTitle,
        videoStart: tmp_videoStart,
        videoDuration: videoDonSet.duration
      };

      const videoSendChk = await setVideoDonationSend(videoDonData);

      if (videoSendChk) {
        // 에러 초기화
        error.userName = '';
        error.videoUrl = '';
        error.videoStart = '';
        error.videoEndSe = '';
        // 입력값 초기화
        videoDonSet.url = '';
        videoDonSet.limit = 10;
        videoDonSet.start = 0;
        videoDonSet.urlChk = false;
        DonDefSet.preview = false;
        //toast.success('도네이션 전달 완료.');
      } else {
        //toast.error('도네이션 전달 불가.');
      }
    }

    // 수정필요
    async function setVideoDonationSend(data: DonationVideoEntry) {
      const sendData = JSON.stringify({
        type: 'send',
        data: data
      });
      // 도네이션 api 서버로 전송
      const url = `http://localhost:10030/donation/send/`;
      try {
        const { data } = await axios.post(sendData);
        if (!data || !data.result) {
          return false;
        }
        return true;
      } catch (e) {
        console.error('unknown error', e);
        return false;
      }
    }
  };
</script>

<div class="modal">
  <div class="title">
    <div class="icon">
      <i class="fas fa-satellite-dish" />
    </div>
    <h3>도네이션 보내기</h3>
  </div>
  <button class="modal-close" on:click={close}>
    <i class="fas fa-times" />
  </button>
  <div class="don-content">
    <div class="don-input">
      <p class="input-title">닉네임</p>
      <div class="input-box">
        <input
          type="text"
          bind:value={videoDonSet.user_name}
          on:keyup={donNameChk(videoDonSet.user_name)}
        />
        {#if error.userName}<p>{error.userName}</p>{/if}
      </div>
    </div>
    <div class="don-input">
      <p class="input-title">비디오 주소</p>
      <div class="input-box">
        <input
          type="text"
          bind:value={videoDonSet.url}
          on:keyup={donVideoUrlChk(videoDonSet.url)}
        />
        {#if error.videoUrl}<p>{error.videoUrl}</p>{/if}
      </div>
    </div>
    <div class="don-input">
      <p class="input-title">비디오 길이</p>
      <div class="input-box">
        <input type="number" bind:value={videoDonSet.limit} on:keyup={donVideoLimitChk} />
        {#if error.videoEndSe}<p>{error.videoEndSe}</p>{/if}
      </div>
    </div>
    <div class="don-input">
      <p class="input-title">비디오 시작지점</p>
      <div class="input-box">
        <input type="number" bind:value={videoDonSet.start} on:keyup={donVideoStartChk} />
        {#if error.videoStart}<p>{error.videoStart}</p>{/if}
      </div>
    </div>
    {#if DonDefSet.preview}
      <div class="video-view">
        <hr />
        <div class="video-view-title">
          <h3>보낼 비디오 정보 표기</h3>
        </div>
        <div class="video-box">
          <div class="video-thumbnails">
            <iframe
              width="368"
              height="207"
              src="https://www.youtube.com/embed/{videoDonSet.urlId}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
            <!--<img src={videoViewRow.thumbnails.standard.url} />-->
          </div>
          <div class="video-info">
            <h5 class="video-title">{videoViewRow.title.trim()}</h5>
            <p class="channel-title">{videoViewRow.channelTitle.trim()}</p>
            {#if videoViewRow.tags}
              <div class="video-tag">
                {#each videoViewRow.tags as item}
                  <p class="tag-box">{item}</p>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/if}
    <div class="don-sub" on:click={donVideoSub}>
      <span class="icon">
        <i class="fas fa-paper-plane" />
      </span>
      <h3>후원 하기</h3>
    </div>
  </div>
</div>

<style lang="scss">
  :global(p.tag-box) {
    width: auto;
    height: auto;
    font-size: 14px;
    padding: 8px 18px;
    margin-bottom: 5px;
    margin-right: 10px;
    border-radius: 18px;
    background-color: #202225;
    text-shadow: 0 1px 3px rgb(0 0 0 / 75%);
  }
  .modal {
    position: relative;
    width: 480px;
    height: auto;
    max-width: 90%;
    max-height: 90%;
    background: var(--primary-background-color);
    border-radius: 2px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 0 15px 0 rgba(0, 0, 0, 0.02),
      0 0 20px 4px rgba(0, 0, 0, 0.06);

    * {
      padding: 0%;
      margin: 0%;
    }

    .title {
      width: calc(100% - 30px);
      height: auto;
      padding: 5px 15px;
      display: flex;
      margin-bottom: 15px;
      .icon {
        width: 46px;
        height: 46px;
        color: var(--primary-foreground-color);
        margin: 0%;
        text-align: center;
        i {
          font-size: 24px;
          padding: 11px 11px;
        }
      }
      h3 {
        margin: 0%;
        width: auto;
        color: var(--primary-foreground-color);
        padding: 14px 10px;
        padding-right: 0px;
        font-size: 20px;
        height: auto;
      }
    }
    .modal-close {
      width: 58px;
      height: 58px;
      position: absolute;
      top: 0%;
      right: 0%;

      background-color: var(--primary-hoverground-color);
      border: 1px solid var(--primary-hoverground-color);
      border-radius: 0%;
      text-align: center;

      i {
        font-size: 24px;
        line-height: 42px;
        padding-left: 2px;
        color: var(--primary-foreground-color);
      }

      &:hover {
        background-color: var(--primary-activeground-color);
        border: 1px solid var(--primary-activeground-color);

        i {
          color: var(--primary-activeground-font-color);
        }
      }

      &:active {
        background-color: var(--primary-activeground-color);
        border-color: var(--primary-activeground-color);

        i {
          color: var(--primary-activeground-font-color);
        }
      }
    }

    // 컨텐츠영역 scss

    .don-content {
      width: 100%;
      height: auto;
      // 입력 값 박스형
      .don-input {
        width: 100%;
        height: auto;
        display: flex;
        flex-flow: wrap;
        padding-bottom: 20px;
        // 현재 처리기
        .input-box {
          width: calc(100% - 20px);
          height: 50px;
          margin: 0 10px;
          margin-bottom: 5px;
          position: relative;

          input {
            width: 100%;
            height: 50px;
            float: left;
            color: var(--primary-foreground-color);
            font-size: 16px;

            background-color: var(--primary-hoverground-color);
            border: 1px solid var(--primary-hoverground-color);

            border-radius: 5px;
            border: 0px;
            padding: 10px;
            font-size: 18px;
          }
          p {
            color: #ff4081 !important;
            font-size: 12px !important;
            padding-bottom: 5px;
            position: absolute;
            bottom: -18px;
            left: 10px;
          }
        }
        .input-title {
          width: 100%;
          height: 20px;
          font-size: 14px;
          color: var(--primary-foreground-color);
          padding-left: 10px;
          margin-bottom: 5px;
        }
      }
      .video-view {
        width: 100%;
        height: 320px;
        margin-top: 15px;
        margin-bottom: 35px;

        hr {
          border-color: var(--primary-hoverground-color);
          margin-bottom: 15px;
        }
        .video-view-title {
          width: calc(100% - 15px);
          height: auto;
          margin-left: 15px;
          padding-bottom: 10px;
          font-size: 18px;
          font-weight: bolder;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--primary-foreground-color);
          text-shadow: 0 1px 3px rgb(0 0 0 / 75%);
        }
        .video-box {
          width: 100%;
          height: 100%;
          //display: flex;
          margin-left: 10px;

          .video-thumbnails {
            width: 460px;
            height: 207px;
            margin-right: 10px;
            background-color: #000;
            box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%),
              0px 1px 3px 0px rgb(0 0 0 / 12%);
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .video-info {
            width: calc(100% - 20px);
            height: 80px;
            color: var(--primary-foreground-color);
            margin-top: 10px;
            .video-title {
              width: 100%;
              height: auto;
              padding-bottom: 5px;
              font-size: 18px;
              font-weight: bolder;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-shadow: 0 1px 3px rgb(0 0 0 / 75%);
            }
            .channel-title {
              width: 100%;
              height: auto;
              padding-bottom: 8px;
              font-size: 14px;
              font-weight: bolder;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              text-shadow: 0 1px 3px rgb(0 0 0 / 75%);
            }
            .video-tag {
              width: 100%;
              max-height: 35px;
              display: flex;
              flex-wrap: wrap;
              overflow: hidden;
              p {
                width: auto;
                height: auto;
                font-size: 14px;
                padding: 8px 18px;
                margin-bottom: 5px;
                margin-right: 10px;
                border-radius: 18px;
                background-color: #202225;
                text-shadow: 0 1px 3px rgb(0 0 0 / 75%);
              }
            }
          }
        }
      }
      .don-sub {
        width: calc(100% - 20px);
        height: 50px;
        padding: 10px;
        margin-top: 20px;
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
        color: var(--primary-foreground-color);
        background-color: #ff4081;
        font-size: 36px;
        text-align: center;

        .icon {
          width: auto;
          height: auto;
          text-align: center;
          display: inline-block;
          margin-right: 10px;
        }
        h3 {
          font-size: 28px;
          font-weight: bolder;
          display: inline-block;
        }
      }
    }
  }

  // 모바일 처리
  @media (min-width: 320px) and (max-width: 500px) {
    .modal {
      position: fixed;
      bottom: 0px;
      width: 100%;
      max-width: 100%;
      height: calc(100% - 50px);
      max-height: calc(100% - 50px);
      display: flex;
      flex-direction: column;
      .don-content {
        overflow: auto;
      }
    }
  }
</style>
