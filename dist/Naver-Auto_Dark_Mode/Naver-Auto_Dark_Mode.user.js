// ==UserScript==
// @name        네이버: 자동 다크 모드
// @description 브라우저의 다크 모드 설정에 따라서 자동으로 다크 모드로 전환합니다.
// @namespace   https://github.com/jjoons
// @author      JS Lee
// @version     0.1.2
// @license     MIT
// @homepage    https://github.com/jjoons/userscript
// @icon        https://icons.duckduckgo.com/ip3/www.naver.com.ico
// @updateURL   https://github.com/jjoons/userscript/raw/main/dist/Naver-Auto_Dark_Mode/Naver-Auto_Dark_Mode.user.js
// @downloadURL https://github.com/jjoons/userscript/raw/main/dist/Naver-Auto_Dark_Mode/Naver-Auto_Dark_Mode.user.js
// @match       https://www.naver.com/
// @noframes
// ==/UserScript==
void (function (D, L) {
    const darkMode = matchMedia('(prefers-color-scheme: dark)');
    const { dark } = D.documentElement.dataset;
    if (dark) {
        const matchMode = () => (darkMode.matches && dark === 'true') || (!darkMode.matches && dark === 'false');
        const switchMode = (mode) => {
            const nDarkMode = mode ?? matchMode() ? null : darkMode.matches;
            if (typeof nDarkMode === 'boolean') {
                D.cookie = `NDARK=${nDarkMode ? 'Y' : 'N'}; domain=naver.com; max-age=31536000`; // 1 Year
                L.reload();
            }
        };
        darkMode.addEventListener('change', function () {
            switchMode();
        });
        switchMode();
    }
})(document, location);
