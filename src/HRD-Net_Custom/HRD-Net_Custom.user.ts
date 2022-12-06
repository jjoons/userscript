// ==UserScript==
// @name        HRD-Net
// @description 직업훈련포털을 이용하면서 불편했던 부분을 수정합니다.
// @namespace   https://github.com/jjoons
// @author      JS Lee
// @version     0.1.2
// @license     MIT
// @homepage    https://github.com/jjoons/userscript
// @icon        https://www.hrd.go.kr/new_images/common/favicon.ico
// @updateURL   https://github.com/jjoons/userscript/raw/main/dist/HRD-Net_Custom/HRD-Net_Custom.user.js
// @downloadURL https://github.com/jjoons/userscript/raw/main/dist/HRD-Net_Custom/HRD-Net_Custom.user.js
// @match       https://www.hrd.go.kr/*
// @grant       GM_addStyle
// @noframes
// ==/UserScript==

void (function (D, L) {
  'use strict'

  const createElements = <T extends keyof HTMLElementTagNameMap>(
    tagName: T,
    count: number,
    options?: ElementCreationOptions
  ) => [...Array(count)].map(() => D.createElement<T>(tagName, options))

  D.oncontextmenu = null

  if (L.pathname === '/hrdp/ps/ppsgo/PPSGO0100T.do') {
    // 나의 정보 > 나의 관심 > 나의 관심정보 > 훈련

    const schoolListEl = D.querySelector<HTMLUListElement>('ul#ncsList')

    GM_addStyle?.(`ul#ncsList > li > .title > .award {
      background-position: center;
    }`)

    addEventListener('load', () => {
      const sortAreaEl = D.querySelector<HTMLDivElement>('form[name=searchForm1] div.sortArea')

      if (sortAreaEl) {
        const [topArea, checkBoxArea] = createElements('div', 2)
        sortAreaEl.after(topArea)

        const checkBox = D.createElement('input')
        checkBox.type = 'checkbox'
        checkBox.addEventListener('change', function () {
          const checkBoxEls =
            schoolListEl?.querySelectorAll<HTMLInputElement>(
              'li input[type="checkbox"][name="intrstInfoSeqNo"]'
            ) ?? []

          for (const i of checkBoxEls) {
            ;(this.checked ? !i.checked : i.checked) && i.click()
          }
        })
        const checkBoxLabel = D.createElement('label')
        checkBoxLabel.innerText = '모두 선택'

        checkBoxArea.append(checkBox, checkBoxLabel)
        topArea.append(checkBoxArea)
      }
    })
  } else if (L.pathname === '/hrdp/mb/pmbao/PMBAO0100T.do') {
    // 로그인

    const formEl = D.querySelector<HTMLFormElement>('form[name=userloginForm]')

    formEl &&
      addEventListener('load', () => {
        const virtualKeyboardToggleEl = formEl.querySelector<HTMLImageElement>(
          'img#Tk_userloginPwd_checkbox'
        )
        if (virtualKeyboardToggleEl?.src.endsWith('on.png')) {
          virtualKeyboardToggleEl.click()
        }
      })
  } else if (L.pathname === '/hrdp/ti/ptiao/PTIAO0300L.do') {
    // 훈련과정 > 국민내일배움카드 훈련과정

    GM_addStyle?.(`.infoView > ul {
      z-index: 90;
    }`)
  } else if (L.pathname === '/hrdp/co/pcobo/PCOBO0100P.do') {
    // 훈련과정 상세

    const trainingTitleEl = D.querySelector<HTMLHeadingElement>('.box h4.tit')
    const schoolNameEl = D.querySelector<HTMLParagraphElement>('.box p.add')
    const trainingTitleNode = trainingTitleEl?.firstChild
    const schoolName = schoolNameEl?.innerText.replace(/[\n\t]/g, '') ?? ''

    if (trainingTitleNode instanceof Text) {
      const trainingTitle = trainingTitleNode.wholeText.replace(/[\n\t]/g, '')

      D.title = `${trainingTitle} - ${schoolName} | HRD-Net`
    }
  }
})(document, location)
