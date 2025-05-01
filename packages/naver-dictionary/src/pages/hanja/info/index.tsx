import { DOMObserver } from 'userscript-utils/dom'

let isInitialized = false

export const initHanjaInfoPage = () => {
  if (!isInitialized) {
    const domObserver = DOMObserver.getInstance()

    domObserver.subscribe<HTMLElement>({
      selector: '[lang*="ko"]',
      onAdd: ({ node }) => {
        if (!node.dataset.naverDictCustomCorrection) {
          // 이체자 확인
          if (node.matches('.section_hanja_info ul.hanja_list > li.hanja_item .hanja_word')) {
            const descEl = node.nextElementSibling

            if (descEl instanceof HTMLElement && descEl.matches('.desc')) {
              if (descEl.innerText.includes('일본자')) {
                node.lang = 'ja'
                node.dataset.naverDictCustomCorrection = 'true'
              } else if (descEl.innerText.includes('간체자')) {
                node.lang = 'zh-CN'
                node.dataset.naverDictCustomCorrection = 'true'
              }
            }
          }
        }
      },
      deep: {
        add: 'all',
      },
    })

    isInitialized = true
  }
}
