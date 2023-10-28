<script lang="ts">
  import { LinkUtils } from '../../../util/link/LinkUtils';

  import IframeContentView from './IframeContentView.svelte';

  export let src: string | null = null;
  $: link = getLink(src);

  const getLink = (src: string | null): string => {
    return LinkUtils.addQuery(src ?? '', 'parent', location.hostname);
  };
</script>

<IframeContentView src={link} allowfullscreen={true} />
