<script lang="ts">
  export let title = '';
  export let subtitle = '';
  export let value = '';
  export let name = '';
  export let placeholder = '';
  export let significant = '';
</script>

<div class="input-group">
  <p>
    {title}
    {#if subtitle}<small>({subtitle})</small>{/if}
  </p>
  <input type="text" bind:value {name} {placeholder} />
  {#if significant == 'youtube'}
    <p>
      <br />
      유튜브의 경우 "watch?v="의 뒤에 값이 필요합니다.
      <br />
      <br />
      <b>해당 값은 생방송을 키고 확인 후 변경이 계속 필요합니다.</b>
    </p>
  {/if}
</div>

<style lang="scss">
  .input-group {
    width: 100%;
    margin-bottom: 15px;

    p {
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      background: var(--primary-hoverground-color);
      border: 0px;
      border-radius: 0%;
      color: var(--primary-foreground-color);
      padding: 15px 10px;
    }
  }
</style>
