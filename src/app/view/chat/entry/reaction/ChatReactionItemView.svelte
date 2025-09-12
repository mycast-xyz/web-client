<script lang="ts">
  import type { ChatReactionItemParam as Param } from './ChatReactionItemParam';

  export let param: Param;
  $: title = makeTitle(param);

  function makeTitle(param: Param) {
    const { users } = param;
    const { length } = users;
    const [{ nickname }] = users;
    return length > 1 ? `${nickname} 외 ${length - 1}명` : nickname;
  }
</script>

<div class="reaction-item">
  {#if param.type === 'emoji-image'}
    <img src={param.value.url} alt={`:${param.value.name}:`} />
  {:else if param.type === 'emoji'}
    {#if param.value === 'thumb-up'}
      <span>👍</span>
    {:else if param.value === 'thumb-down'}
      <span>👎</span>
    {:else if param.value === 'clap'}
      <span>👏</span>
    {:else if param.value === 'laugh'}
      <span>😆</span>
    {:else if param.value === 'sad'}
      <span>😢</span>
    {:else if param.value === 'disgust'}
      <span>🤢</span>
    {:else if param.value.startsWith('c')}
      <span>{param.value.substring(1)}</span>
    {/if}
  {/if}
  <div class="reaction-item-title">
    <span> {title} </span>
  </div>
</div>

<style lang="scss">
  .reaction-item {
    position: relative;
    display: inline-block;
    cursor: default;

    img {
      width: 24px;
      height: 24px;
      border-radius: 4px;
    }

    .reaction-item-title {
      position: absolute;
      left: 0;
      bottom: 20px;
      display: none;
      width: 150px;
      min-height: 20px;

      span {
        color: var(--primary-foreground-color);
        padding: 5px;
        border-radius: 2px;
        font-size: 12px;
        line-height: 20px;
        background: var(--primary-hoverground-color);
      }
    }
    &:hover {
      .reaction-item-title {
        display: inline-block;
      }
    }
  }
</style>
