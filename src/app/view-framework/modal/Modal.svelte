<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let title: string;
  export let icon: string;

  const dispatch = createEventDispatcher();
</script>

<div class="modal">
  <div class="title">
    <div class="icon">
      <i class={icon} />
    </div>
    <h3>{title}</h3>
  </div>
  <div class="body">
    <slot name="body" />
  </div>
  <div class="footer">
    <slot name="footer" />
  </div>
  <button class="modal-close" on:click={(_) => dispatch('oncloseclick')}>
    <i class="fas fa-times" />
  </button>
</div>

<style lang="scss">
  .modal {
    position: relative;
    width: 500px;
    height: auto;
    max-width: 100%;
    max-height: calc(100% - 100px);
    background: #2a2f38;
    color: #ffffff;
    border-radius: 2px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08), 0 0 15px 0 rgba(0, 0, 0, 0.02),
      0 0 20px 4px rgba(0, 0, 0, 0.06);

    .title {
      width: calc(100% - 30px);
      height: auto;
      padding: 5px 15px;
      display: flex;
      margin-bottom: 15px;
      .icon {
        width: 46px;
        height: 46px;
        color: #ffffff;
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
        color: #ffffff;
        padding: 14px 10px;
        padding-right: 0px;
        font-size: 20px;
        height: auto;
      }
    }
    .body {
      overflow-y: auto;
      width: calc(100% - 10px);
      min-height: 10px;
      margin: 5px;
      * {
        padding: 0%;
        margin: 0%;
      }
    }
    .footer {
      width: calc(100% - 10px);
      min-height: 10px;
      margin: 5px;
    }
  }
  .modal-close {
    width: 58px;
    height: 58px;
    position: absolute;
    top: 0%;
    right: 0%;

    background-color: #1f2226;
    border: 1px solid #1f2226;
    border-radius: 0%;
    text-align: center;

    i {
      font-size: 24px;
      line-height: 42px;
      padding-left: 2px;
      color: #ffffff;
    }

    &:hover {
      background-color: #ff4081;
      border: 1px solid #ff4081;

      i {
        color: #ffffff;
      }
    }

    &:active {
      background-color: #e91e63;
      border-color: #e91e63;

      i {
        color: #ffffff;
      }
    }
  }

  @media (min-width: 320px) and (max-width: 500px) {
    .modal {
      width: 100%;
      height: calc(100% - 50px) !important;
      max-height: calc(100% - 50px) !important;
      position: fixed;
      top: 50px;
      .body {
        height: calc(100vh - 173px);
      }

      .footer {
        height: 50px;
      }
    }
  }
</style>
