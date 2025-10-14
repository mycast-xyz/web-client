<script lang="ts">
  import { EmojiUtils } from '../../../model/chat/emoji/EmojiUtils';

  export let body = '';

  $: isSpoiler = body.startsWith('##') && body.endsWith('##') && body.length > 4;
  $: isEmoji = EmojiUtils.isEmoji(body);
  $: replaced = body
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/##(.+?)##/g, '$1');
</script>

<div>
  <p class:emoji={isEmoji}>
    <span class:spoiler={isSpoiler}>{replaced}</span>
  </p>
</div>

<style lang="scss">
  div {
    width: 100%;
    position: relative;
    p {
      width: 100%;
      font-size: 16px;
      line-height: 22px;

      &.emoji {
        font-size: 50px;
        line-height: 50px;
        text-align: center;
      }
    }

    span.spoiler {
      position: relative;
      display: inline-block;
      cursor: pointer;
      color: transparent;
      filter: blur(3px);
      transition: all 0.3s ease;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(0, 0, 0, 0.15) 4px
          ),
          linear-gradient(120deg, #999 0%, #666 100%);
        mix-blend-mode: overlay;
        filter: contrast(1.3) brightness(1.1);
        border-radius: 4px;
        z-index: 1;
        transition: opacity 0.3s ease;
      }

      &:hover {
        color: inherit;
        filter: none;

        &::before {
          opacity: 0;
        }
      }
    }
  }
</style>
