<script lang="ts">
  import type { RichText } from './RichText';
  import { RichTextMerger } from './RichTextMerger';
  import { RichTextParser } from './RichTextParser';
  import type { RichTextProp } from './RichTextProp';

  export let body: string;

  const bigEmojiThreashold = 3;
  const parser = new RichTextParser();
  const merger = new RichTextMerger();
  let richTexts: RichText[];
  let merged: RichText[];
  let isSpoiler = false;

  $: {
    try {
      const prop: RichTextProp = JSON.parse(body);
      const { text, emojis } = prop;
      isSpoiler = text.startsWith('##') && text.endsWith('##') && text.length > 4;
      const replaced = text.replace(/##(.+?)##/g, '$1');
      richTexts = parser.parse(replaced, emojis || []);
      merged = merger.merge(richTexts);
    } catch {}
  }

  $: isOnlyEmojis =
    merged.length === 1 &&
    merged[0].type === 'emoji-images' &&
    merged[0].emojis.length <= bigEmojiThreashold;
</script>

<div>
  <p>
    <span class:spoiler={isSpoiler}>
      {#each merged as content}
        {#if content.type === 'emoji-image'}
          <span class="emoji-solo-image">
            <img
              class="emoji-image"
              class:big={richTexts.length === 1}
              src={content.url}
              alt={`:${content.name}:`}
              on:contextmenu={() => false}
            />
          </span>
        {:else if content.type === 'emoji-images'}
          <span class="emoji-images">
            {#each content.emojis as emoji}
              <img
                class="emoji-image"
                class:big={isOnlyEmojis}
                src={emoji.url}
                alt={`:${emoji.name}:`}
                on:contextmenu={() => false}
              />
            {/each}
          </span>
        {:else if content.type === 'plain'}
          <span>{@html content.text}</span>
        {/if}
      {/each}
    </span>
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

      .emoji-images {
        img:first-child {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }

        img:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }

      .emoji-solo-image {
        img {
          border-radius: 5px;
        }
      }

      .emoji-image {
        display: inline-block;
        vertical-align: middle;
        width: 32px;
        height: 32px;
        margin: 0px;
        object-fit: contain;

        &.big {
          width: 64px;
          height: 64px;
        }
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
