<script lang="ts">
  import VideoAttachment from '../../src/app/view/chat/VideoAttachment.svelte';
  import UploadedVideoPack from '../../src/app/view/chat/pack/video/UploadedVideoPack.svelte';
  import { SessionService } from '../../src/app/service/SessionService';
  import { SocketService } from '../../src/app/service/SocketService';
  SessionService.getPrivateKey = () => 'test-session';
  SocketService.chat = {
    execute: (_key: string, _type: string, url: string) => {
      document.querySelector('#sent')!.textContent = url;
    }
  } as typeof SocketService.chat;
</script>

<div style="position:relative;margin-top:250px"><VideoAttachment connected={true} /></div>
<p id="sent" />
<UploadedVideoPack url="https://mycast.xyz:9011/video/12345678-1234-1234-1234-123456789abc/watch" />
<div style="height:2000px" />
