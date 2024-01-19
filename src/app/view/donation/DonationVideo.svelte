<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { SessionService } from '../../service/SessionService';

  type videoSet = {
    donationUse: boolean;
    videoLimit: number;
  };
  let videoSet: videoSet = {
    donationUse: false,
    videoLimit: 0
  };

  onMount(async () => {
    const donationVideoSetting = await getDonationVideoUse();
    if (donationVideoSetting['donation_use'] == 0) {
      videoSet.donationUse = false;
    } else {
      videoSet.donationUse = true;
    }
    videoSet.videoLimit = donationVideoSetting['video_limit'];
  });

  // 사용자 비디오 도네이션 데이터 가져오기
  async function getDonationVideoUse(): Promise<any> {
    const privateKey = SessionService.getPrivateKey();
    const uri = `http://localhost:9940/users/${privateKey}/video/data/all`;
    const { data: donationVideoSetting } = await axios.get(uri);

    console.log(donationVideoSetting.length);

    if (donationVideoSetting.length > 0) {
      return donationVideoSetting[0];
    } else {
      return null;
    }
  }

  // 사용자 비디오 도네이션 사용 설정 변경
  async function setDonationVideoUse(videoUse: boolean): Promise<boolean> {
    // 사용값을 넘겨주기 위한 변환작업
    let videoUseNum: string = '';
    if (videoUse) {
      videoUseNum = '1';
    } else {
      videoUseNum = '0';
    }

    // 도네이션 api 서버로 전송
    const privateKey = SessionService.getPrivateKey();
    const host = `http://localhost:9940/users/${privateKey}`;
    const url = `${host}/video/set/use`;
    try {
      const param = new URLSearchParams();
      param.append('donationUse', videoUseNum);
      const { data } = await axios.post<Result>(url, param.toString());
      if (!data || !data.result) {
        return false;
      }
      return true;
    } catch (e) {
      console.error('unknown error', e);
      return false;
    }
  }

  async function setDonationVideoLimit(videoLimit: string): Promise<boolean> {
    const videoLimitNum: number = parseInt(videoLimit.trim());
    // 숫자 체크
    if (videoLimitNum == 0) {
      //error.sys_title_template = "템플릿 내용을 넣어주세요.";
      return false;
    } else if (videoLimitNum > 3601) {
      //error.sys_title_template = "32자 까지 입력됩니다.";
      return false;
    } else {
      // 도네이션 api 서버로 전송
      const privateKey = SessionService.getPrivateKey();
      const host = `http://localhost:9940/users/${privateKey}`;
      const url = `${host}/video/set/limit`;
      try {
        const param = new URLSearchParams();
        param.append('videoLimit', videoLimit);
        const { data } = await axios.post<Result>(url, param.toString());
        if (!data || !data.result) {
          return false;
        }
        return true;
      } catch (e) {
        console.error('unknown error', e);
        return false;
      }
    }
  }

  type Result = {
    result: boolean;
  };
</script>

<article class="layout">
  <div class="container">
    <div class="components">
      <div class="title">
        <h1>후원 설정 / <small> Support Setting</small></h1>
      </div>
      <div class="card">
        <div class="btn-group">
          <h3>도네이션 사용하기</h3>
          <label class="switch">
            <input
              type="checkbox"
              bind:checked={videoSet.donationUse}
              on:change={setDonationVideoUse(videoSet.donationUse)}
            />
            <span class="slider round" />
          </label>
        </div>
      </div>
    </div>
    <div class="components">
      <div class="title">
        <h1>후원 영상 설정 / <small> Support Video System</small></h1>
      </div>
      <div class="card">
        <div class="input-group">
          <h3 class="input-title">영상 길이 제한</h3>
          <div class="input-box">
            <input
              bind:value={videoSet.videoLimit}
              on:keyup={setDonationVideoLimit(videoSet.videoLimit)}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</article>

<style lang="scss">
  .layout {
    width: 100%;
    .container {
      min-width: 900px;
      max-width: 1300px;
      margin: auto;
      padding-bottom: 40px;

      .components {
        width: 100%;
        margin-top: 20px;
        background-color: var(--primary-background-color);
        color: var(--primary-foreground-color);

        .title {
          width: calc(100% - 20px);
          height: 32px;
          background-color: var(--primary-background-color);
          border-bottom: 1px solid var(--primary-foreground-color);
          padding: 10px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          h1 {
            font-size: 24px;
            font-weight: bolder;

            small {
              color: var(--primary-activeground-color);
              font-size: 20px;
              font-weight: normal;
            }
          }
        }
        .card {
          width: calc(100% - 20px);
          height: auto;
          background-color: var(--primary-background-color);
          color: var(--primary-foreground-color);
          padding: 10px;
          padding-top: 15px;

          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;

          box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%),
            0px 1px 3px 0px rgb(0 0 0 / 12%);

          // 입력 값 박스형
          .input-group {
            width: 100%;
            height: auto;
            display: flex;
            padding-bottom: 10px;

            // 현재 처리기
            .input-box {
              width: 80%;
              height: 60px;
              position: relative;
              margin-left: auto;
              margin-right: 0px;
              input {
                width: 100%;
                color: var(--primary-foreground-color);
                background-color: var(--primary-hoverground-color);
                border-radius: 5px;
                border: 0px;
                padding: 10px;
                font-size: 18px;
              }
            }
            .input-title {
              width: 200px;
              height: 30px;
              color: var(--primary-foreground-color);
              font-size: 18px;
              line-height: 20px;
              padding: 10px;
              margin-left: 0px;
            }
          }
          // 버튼형 박스
          .btn-group {
            width: 100%;
            min-height: 40px;
            height: auto;
            padding-bottom: 10px;
            display: flex;
            h3 {
              font-size: 18px;
              font-weight: bolder;
              line-height: 40px;
              padding-left: 10px;
              display: inline-block;
              margin-left: 0px;
            }

            /* The switch - the box around the slider */
            .switch {
              width: 60px;
              height: 34px;
              margin-left: auto;
              margin-right: 0px;
              position: relative;
              display: inline-block;
              margin-right: 15px;
              margin-left: auto;
              margin-right: 0px;

              input {
                opacity: 0;
                width: 0;
                height: 0;
              }
              .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--primary-hoverground-color);
                -webkit-transition: 0.4s;
                transition: 0.4s;
              }

              .slider:before {
                position: absolute;
                content: '';
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                -webkit-transition: 0.4s;
                transition: 0.4s;
              }
              input:checked + .slider {
                background-color: var(--primary-activeground-color);
              }
              input:focus + .slider {
                box-shadow: 0 0 1px var(--primary-activeground-color);
              }
              input:checked + .slider:before {
                -webkit-transform: translateX(26px);
                -ms-transform: translateX(26px);
                transform: translateX(26px);
              }
              .slider.round {
                border-radius: 34px;
              }
              .slider.round:before {
                border-radius: 50%;
              }
            }
          }
        }
      }
    }
  }
</style>
