<script lang="ts">
  import type { ChatReaction } from '../../../../model/chat/ChatReaction';
  import type { ChatReactionItemParam as Param } from './ChatReactionItemParam';
  import Item from './ChatReactionItemView.svelte';

  export let reactions: ChatReaction[];

  const merge: boolean = false;
  $: params = merge ? mergeReaction(reactions) : getParam(reactions);

  function getParam(reactions: ChatReaction[]): Param[] {
    return reactions.map((r) => {
      if (r.type === 'emoji') {
        return {
          users: [r.user],
          type: r.type,
          value: r.value
        };
      } else {
        return {
          users: [r.user],
          type: r.type,
          value: r.value
        };
      }
    });
  }

  function mergeReaction(reactions: ChatReaction[]): Param[] {
    const merged: Param[] = [];
    for (const entry of reactions) {
      const found = merged.find((r) => r.value === entry.value);
      if (!found) {
        if (entry.type === 'emoji') {
          merged.push({
            users: [entry.user],
            type: entry.type,
            value: entry.value
          });
        } else {
          merged.push({
            users: [entry.user],
            type: entry.type,
            value: { url: entry.value.url, name: entry.value.name }
          });
        }
      } else {
        found.users.push(entry.user);
      }
    }
    return merged;
  }
</script>

<div class="reaction">
  {#each params as param}
    <Item {param} />
  {/each}
</div>
