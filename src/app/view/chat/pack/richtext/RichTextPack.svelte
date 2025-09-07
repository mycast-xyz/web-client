<script lang="ts">
  import type { RichText } from './RichText';
  import { RichTextParser } from './RichTextParser';
  import type { RichTextProp } from './RichTextProp';

  export let body: string;
  const parser = new RichTextParser();
  let richTexts: RichText[];

  $: {
    try {
      const prop: RichTextProp = JSON.parse(body);
      const { text, emojis } = prop;
      richTexts = parser.parse(text, emojis || []);
    } catch {}
  }
</script>

<div>
  <p>
    {#each richTexts as content}
      {#if content.type === 'emoji-image'}
        <span><img class="emoji-image" src={content.url} alt={`:${content.name}:`} /></span>
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

      .emoji-image {
        display: inline-block;
        vertical-align: middle;
        width: 22px;
        height: 22px;
        margin: 0px;
        object-fit: contain;
      }
    }
  }
</style>
