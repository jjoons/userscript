"use strict";
// ==UserScript==
// @name        HRD-Net
// @description 직업훈련포털을 이용하면서 불편했던 부분을 수정합니다.
// @namespace   https://github.com/jjoons
// @author      JJoonS
// @version     0.1.3
// @license     MIT
// @homepage    https://github.com/jjoons/userscript
// @icon        https://icons.duckduckgo.com/ip3/www.hrd.go.kr.ico
// @updateURL   https://github.com/jjoons/userscript/raw/main/dist/scripts/HRD-Net_Custom/HRD-Net_Custom.user.js
// @downloadURL https://github.com/jjoons/userscript/raw/main/dist/scripts/HRD-Net_Custom/HRD-Net_Custom.user.js
// @match       https://www.hrd.go.kr/*
// @grant       GM_addStyle
// @noframes
// ==/UserScript==
void (function (D, L) {
    'use strict';
    const createElements = (tagName, count, options) => [...Array(count)].map(() => D.createElement(tagName, options));
    D.oncontextmenu = null;
    if (L.pathname === '/hrdp/ps/ppsgo/PPSGO0100T.do') {
        // 나의 정보 > 나의 관심 > 나의 관심정보 > 훈련
        const schoolListEl = D.querySelector('ul#ncsList');
        GM_addStyle?.(`ul#ncsList > li > .title > .award {
      background-position: center;
    }`);
        addEventListener('load', () => {
            const sortAreaEl = D.querySelector('form[name=searchForm1] div.sortArea');
            if (sortAreaEl) {
                const [topArea, checkBoxArea] = createElements('div', 2);
                sortAreaEl.after(topArea);
                const checkBox = D.createElement('input');
                checkBox.type = 'checkbox';
                checkBox.addEventListener('change', function () {
                    const checkBoxEls = schoolListEl?.querySelectorAll('li input[type="checkbox"][name="intrstInfoSeqNo"]') ?? [];
                    for (const i of checkBoxEls) {
                        if (this.checked ? !i.checked : i.checked) {
                            i.click();
                        }
                    }
                });
                const checkBoxLabel = D.createElement('label');
                checkBoxLabel.innerText = '모두 선택';
                checkBoxArea.append(checkBox, checkBoxLabel);
                topArea.append(checkBoxArea);
            }
        });
    }
    else if (L.pathname === '/hrdp/mb/pmbao/PMBAO0100T.do') {
        // 로그인
        const formEl = D.querySelector('form[name=userloginForm]');
        if (formEl) {
            addEventListener('load', () => {
                const virtualKeyboardToggleEl = formEl.querySelector('img#Tk_userloginPwd_checkbox');
                if (virtualKeyboardToggleEl?.src.endsWith('on.png')) {
                    virtualKeyboardToggleEl.click();
                }
            });
        }
    }
    else if (L.pathname === '/hrdp/ti/ptiao/PTIAO0300L.do') {
        // 훈련과정 > 국민내일배움카드 훈련과정
        GM_addStyle?.(`.infoView > ul {
      z-index: 90;
    }`);
    }
    else if (L.pathname === '/hrdp/co/pcobo/PCOBO0100P.do') {
        // 훈련과정 상세
        const trainingTitleEl = D.querySelector('.box h4.tit');
        const schoolNameEl = D.querySelector('.box p.add');
        const trainingTitleNode = trainingTitleEl?.firstChild;
        const schoolName = schoolNameEl?.innerText.replace(/[\n\t]/g, '') ?? '';
        if (trainingTitleNode instanceof Text) {
            const trainingTitle = trainingTitleNode.wholeText.replace(/[\n\t]/g, '');
            D.title = `${trainingTitle} - ${schoolName} | HRD-Net`;
        }
    }
})(document, location);
