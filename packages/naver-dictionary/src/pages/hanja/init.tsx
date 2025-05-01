import { GM_addStyle } from '$'
import { DOMObserver } from 'userscript-utils/dom'
import styleCssText from './style.scss?inline'

let isInitialized = false

const styleEl = GM_addStyle(styleCssText)
styleEl.dataset.styleName = 'hanja-init'

/**
 * 한자사전 Init
 */
export const initHanja = () => {
  if (!isInitialized) {
    /* GM_addElement(document.head, 'link', {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    })
    GM_addElement(document.head, 'link', {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
    })
    GM_addElement(document.head, 'link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap',
      crossorigin: 'anonymous',
    }) */

    const headObserver = DOMObserver.getInstance({
      baseNode: document.head,
    })
    const domObserver = DOMObserver.getInstance()

    headObserver.subscribe({
      selector: 'style[data-style-name="global"]',
      onAdd: ({ node }) => {
        node.after(styleEl)
      },
    })

    domObserver.subscribe<HTMLElement>({
      selector: '[lang*="zh"]',
      onAdd: ({ node }) => {
        if (!node.dataset.naverDictCustomHanja) {
          if (node.dataset.naverDictCustomCorrection !== 'true') {
            node.lang = 'ko'
          }

          node.dataset.naverDictCustomHanja = 'true'
        }
      },
      deep: {
        add: 'all',
      },
    })

    isInitialized = true
  }
}
