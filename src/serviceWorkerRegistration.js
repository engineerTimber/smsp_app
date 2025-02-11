// serviceWorkerRegistration.js
// 這是 React 的預設 Service Worker 註冊方法
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.[0-9]{1,3}){3}$/
    )
  );
  
  export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      // 載入服務工作者
      const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
      if (publicUrl.origin !== window.location.origin) {
        return;
      }
      
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
        if (isLocalhost) {
          checkValidServiceWorker(swUrl, config);
        } else {
          registerValidSW(swUrl, config);
        }
      });
    }
  }
  
  function registerValidSW(swUrl, config) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('新內容已安裝，請重新載入頁面！');
              } else {
                console.log('離線模式啟動，資源緩存成功！');
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Service Worker 註冊失敗: ', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    fetch(swUrl)
      .then(response => {
        const contentType = response.headers.get('content-type');
        if (response.status === 404 || (contentType && contentType.indexOf('javascript') === -1)) {
          navigator.serviceWorker.ready.then(registration => {
            registration.unregister();
          });
        } else {
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('沒有網路，離線模式無法啟動');
      });
  }
  