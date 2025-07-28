import { render } from 'preact'
import { onBodyReady } from 'userscript-utils/dom'
import App from './App'
import { AppProviders } from './context'
import { initHanja, initHanjaInfoPage, initHanjaMainPage, initHanjaSearchPage } from './pages/hanja'
import { hookSpaNavigation } from './utils/router'

hookSpaNavigation()

const rootEl = document.createElement('div')
rootEl.id = 'us_n_dict_root'

const bootstrap = () => {
  const { host, pathname, search, hash } = location

  if (host === 'hanja.dict.naver.com' && pathname === '/' && search === '') {
    initHanja()

    if (hash.startsWith('#/main')) {
      initHanjaMainPage()
    } else if (hash.startsWith('#/entry/ccko/')) {
      initHanjaInfoPage()
    } else if (hash.startsWith('#/search?')) {
      initHanjaSearchPage()
    }
  }
}

const init = () => {
  document.body.after(rootEl)

  render(
    <AppProviders>
      <App />
    </AppProviders>,
    rootEl,
  )

  bootstrap()
}

onBodyReady(init)
// addEventListener('DOMContentLoaded', init)
addEventListener('routechange', bootstrap)
