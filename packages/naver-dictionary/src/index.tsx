import { GM_addStyle } from '$'
import { render } from 'preact'
import { DOMObserver, onBodyReady } from 'userscript-utils/dom'
import App from './App'
import { AppProviders } from './context'
import { initHanja, initHanjaInfoPage, initHanjaMainPage, initHanjaSearchPage } from './pages/hanja'
import globalCssText from './styles/global.scss?inline'
import { hookSpaNavigation } from './utils/router'

hookSpaNavigation()

const globalStyleEl = GM_addStyle(globalCssText)
globalStyleEl.dataset.styleName = 'global'

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
  const headObserver = DOMObserver.getInstance({ baseNode: document.head })

  headObserver.subscribe({
    selector: 'link[rel="stylesheet"][href^="https://ssl.pstatic.net"]',
    onAdd: () => {
      document.head.append(globalStyleEl)
    },
  })

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
