// ==UserScript==
// @name        네이버: 자동 다크 모드
// @description 브라우저의 다크 모드 설정에 따라서 자동으로 다크 모드로 전환합니다.
// @namespace   https://github.com/jjoons
// @author      JS Lee
// @version     0.1.3
// @license     MIT
// @homepage    https://github.com/jjoons/userscript
// @icon        https://icons.duckduckgo.com/ip3/www.naver.com.ico
// @updateURL   https://github.com/jjoons/userscript/raw/main/dist/scripts/Naver-Auto_Dark_Mode/Naver-Auto_Dark_Mode.user.js
// @downloadURL https://github.com/jjoons/userscript/raw/main/dist/scripts/Naver-Auto_Dark_Mode/Naver-Auto_Dark_Mode.user.js
// @match       https://www.naver.com/
// @noframes
// ==/UserScript==

void (function (D, L) {
  alert(
    '네이버 홈페이지에서 기기 설정에 따른 다크 모드를 지원하게 되어\n' +
      '더 이상 [' +
      GM_info.script.name +
      '] 유저스크립트를 이용할 필요가 없어졌습니다.\n\n' +
      '확장 프로그램에서 스크립트를 제거하면\n' +
      '이 알림창이 더 이상 나타나지 않습니다.\n\n' +
      '그 동안 이용해 주셔서 감사합니다.',
  )
})(document, location)
