import { GM_addStyle } from '$'
import { useContext, useEffect } from 'preact/hooks'
import { DOMObserver } from 'userscript-utils/dom'
import FloatingToolbar from './components/FloatingToolbar'
import SettingsPanel from './components/SettingsPanel'
import { ThemeContext } from './context/ThemeProvider'
import globalCssText from './styles/global.scss?inline'

const App: preact.FunctionComponent = () => {
  const themeContext = useContext(ThemeContext)

  useEffect(() => {
    const globalStyleEl = GM_addStyle(globalCssText)
    globalStyleEl.dataset.styleName = 'global'

    const headObserver = DOMObserver.getInstance({ baseNode: document.head })

    const headLinkPStaticSubscriber = headObserver.subscribe({
      selector: 'link[rel="stylesheet"][href^="https://ssl.pstatic.net"]',
      onAdd: () => {
        document.head.append(globalStyleEl)
      },
    })

    const headScriptLinkSubscriber = headObserver.subscribe<HTMLScriptElement | HTMLLinkElement>({
      selector: 'script[src], link[rel="stylesheet"][href]',
      onAdd: ({ node }) => {
        /**
         * 페이지를 이동할 때마다 `document.head`에 중복으로 추가되는
         * Element를 제거하여 페이지 이동이 점점 느려지는 문제를 늦춤
         */
        if (node instanceof HTMLScriptElement) {
          const dupArr = Array.from(
            document.head.querySelectorAll<HTMLScriptElement>(`script[src="${node.src}"]`),
          )
          dupArr.slice(0, -1).forEach((e) => e.remove())
        } else if (node instanceof HTMLLinkElement) {
          const dupArr = Array.from(
            document.head.querySelectorAll<HTMLLinkElement>(
              `link[rel="stylesheet"][href="${node.href}"]`,
            ),
          )
          dupArr.slice(0, -1).forEach((e) => e.remove())
        }
      },
    })

    return () => {
      headLinkPStaticSubscriber.unsubscribe()
      headScriptLinkSubscriber.unsubscribe()
      globalStyleEl.remove()
    }
  }, [])

  return (
    <div id="us_n_dict_wrap" data-theme={themeContext.theme}>
      <SettingsPanel />
      <FloatingToolbar />
    </div>
  )
}

export default App
