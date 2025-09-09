<script lang="ts">
  import type { ChatReply } from '../../../../model/chat/ChatReply';
  import { RichTextMerger } from '../../pack/richtext/RichTextMerger';
  import { RichTextParser } from '../../pack/richtext/RichTextParser';

  export let reply: ChatReply;
  let hover = false;
  const parser = new RichTextParser();
  const merger = new RichTextMerger();

  $: richTexts = parser.parse(reply.value, reply.emojis);
  $: mergedTexts = merger.merge(richTexts);
</script>

<div class="entry">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="icon" on:mouseenter={() => (hover = true)} on:mouseleave={() => (hover = false)}>
    <img src={reply.user.icon} alt={reply.user.nickname} />
  </div>
  <div class="content">
    {#each mergedTexts as content}
      {#if content.type === 'emoji-image'}
        <span class="emoji-solo-image">
          <img
            class="emoji-image"
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
    <!-- {reply.value} -->
  </div>
  {#if hover}
    <div class="title">
      <span> {reply.user.nickname} </span>
    </div>
  {/if}
</div>

<style lang="scss">
  .entry {
    position: relative;
    max-width: 100%;
    display: flex;

    .icon img {
      flex-shrink: 0;
      width: 15px;
      height: 15px;
      border-radius: 15px;
      margin-right: 5px;
    }

    .content {
      flex-grow: 1;
      color: var(--primary-foreground-color);
      font-size: 0.8em;
      word-wrap: break-word;
      max-width: calc(100% - 20px);

      .emoji-image {
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        margin: 0px;
        object-fit: contain;
      }
    }

    .title {
      position: absolute;
      left: 0;
      bottom: 25px;
      display: inline-block;
      width: 150px;
      max-width: 150px;
      min-height: 20px;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      color: var(--primary-foreground-color);

      span {
        padding: 5px;
        border-radius: 2px;
        font-size: 12px;
        line-height: 20px;
        background: var(--primary-hoverground-color);
      }
    }
  }
</style>
