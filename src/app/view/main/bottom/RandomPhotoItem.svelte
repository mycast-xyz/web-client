<script lang="ts">
    import type { Photo } from '../../../model/photo/Photo';

    import { onMount } from 'svelte';
    import { WindowService } from '../../../service/WindowService';
    import { PhotoService } from '../../photo/PhotoService';
    
    import BottomBarItem from './BottomBarItem.svelte';

    let photos:Array<Photo>;
    onMount(async() => {
      PhotoService.photos.subscribe((it) => (photos = it));
      await PhotoService.init('');
    });

    function getRandomPhoto(photos: Array<Photo>):Photo {
      PhotoService.loadMore();
      const randomNumber = Math.floor(Math.random() * photos.length);
      return photos[randomNumber]; 
    }

    async function onIconClick() {
      const photo = getRandomPhoto(photos);
      WindowService.openImageViewerPopup(photo.url);
      await PhotoService.loadMore();
    }
  </script>
  
  <BottomBarItem icon="https://i.imgur.com/KD1OX7Z.png" on:iconclick={onIconClick} />