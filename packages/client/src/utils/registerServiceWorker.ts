export const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .then(registration => {
        console.log('Service Worker зарегистрирован:', registration.scope)
      })
      .catch(error => {
        console.error('Ошибка регистрации Service Worker:', error)
      })
  })
}
