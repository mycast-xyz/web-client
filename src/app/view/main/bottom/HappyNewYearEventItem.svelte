<script lang="ts">
  import { WindowService } from '../../../service/WindowService';

  import BottomBarItem from './BottomBarItem.svelte';

  function onIconClick() {
    WindowService.openImageViewerPopup('https://i.ibb.co/mq56D7k/thumb.jpg');
  }
</script>

<BottomBarItem icon="https://i.imgur.com/eaQRibR.png" on:iconclick={onIconClick} />
