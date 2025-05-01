export function hookSpaNavigation() {
  const origPushState = history.pushState

  history.pushState = function (...args) {
    origPushState.apply(this, args)
    window.dispatchEvent(new Event('routechange'))
  }

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('routechange'))
  })

  window.addEventListener('hashchange', () => {
    window.dispatchEvent(new Event('routechange'))
  })
}
