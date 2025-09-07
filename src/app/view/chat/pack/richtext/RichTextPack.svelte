<script lang="ts">
  import type { RichText } from './RichText';
  import { RichTextMerger } from './RichTextMerger';
  import { RichTextParser } from './RichTextParser';
  import type { RichTextProp } from './RichTextProp';

  export let body: string;
  const parser = new RichTextParser();
  const merger = new RichTextMerger();
  let richTexts: RichText[];
  let merged: RichText[];

  $: {
    try {
      const prop: RichTextProp = JSON.parse(body);
      const { text, emojis } = prop;
      richTexts = parser.parse(text, emojis || []);
      merged = merger.merge(richTexts);
    } catch {}
  }
</script>

<div>
  <p>
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
              class:big={richTexts.length === 1}
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
  }
</style>
