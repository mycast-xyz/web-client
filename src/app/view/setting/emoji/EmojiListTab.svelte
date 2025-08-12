<script lang="ts">
  let emojies = [
    { src: 'https://i.imgur.com/v14PNs1.jpeg', name: 'myo' },
    { src: 'https://i.imgur.com/5F0oNc7.png', name: 'me' }
  ];
</script>

<div class="content">
  <h3>내 이모지</h3>

  {#if emojies.length > 0}
    <table>
      <thead>
        <tr>
          <th>이미지</th>
          <th>이름</th>
        </tr>
      </thead>
      <tbody>
        {#each emojies as emoji}
          <tr>
            <td><img src={emoji.src} alt={emoji.name} /></td>
            <td>:{emoji.name}:</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>없음</p>
  {/if}
</div>

<style lang="scss">
  .content {
    font-size: 14px;
    line-height: 1.5;

    button {
      background-color: var(--primary-activeground-color);
      color: var(--primary-activeground-font-color);
      border: none;
      padding: 8px 14px;
      border-radius: 4px;
      cursor: pointer;
      margin: 10px 0;
      font-weight: 600;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      color: var(--primary-foreground-color);
    }

    th,
    td {
      padding: 8px 5px;
      border-bottom: 1px solid #333;
      text-align: center;
      vertical-align: middle;
    }

    img {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      vertical-align: middle;
      margin-right: 8px;
    }
  }
</style>
