import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available - auto-update in background
                    console.log('New version available, updating...');
                    newWorker.postMessage({ type: 'SKIP_WAITING' });
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });

      // Handle controller change - silently reload
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Only reload if we're not in the middle of an active game session
        if (!document.hidden) {
          window.location.reload();
        }
      });
    }
  }, []);
}
