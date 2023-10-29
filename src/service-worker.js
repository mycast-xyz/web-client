if ('serviceWorker' in navigator) {
    addEventListener('load', function () {
        navigator.serviceWorker.register('%sveltekit.assets%/service-worker.js', {scope: './'});
    });
  }