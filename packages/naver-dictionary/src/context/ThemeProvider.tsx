import { createContext } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { DOMObserver } from 'userscript-utils/dom'

export const ThemeContext = createContext<IThemeContext>({
  theme: 'light',
})

/**
 * 테마 변경을 감지하고 테마를 관리하는 Provider
 */
export const ThemeProvider: preact.FunctionComponent = ({ children }) => {
  const [theme, setTheme] = useState<ThemeText>(getPageTheme())

  useEffect(() => {
    const bodyObserver = DOMObserver.getInstance({ baseNode: document.body })
    const subscriber = bodyObserver.subscribe({
      selector: null,
      onAttribute: ({ node, attributeName }) => {
        if (node === document.body && attributeName === 'class') {
          setTheme(getPageTheme())
        }
      },
    })

    return () => {
      subscriber.unsubscribe()
    }
  })

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
}

/**
 * 현재 페이지에 적용된 테마를 찾아서 무슨 테마인지 반환하는 함수
 *
 * @returns 현재 테마에 맞는 값 반환
 */
const getPageTheme = (): ThemeText => {
  if (document.body.classList.contains('is-darkmode')) {
    return 'dark'
  }

  return 'light'
}

type ThemeText = 'light' | 'dark'

interface IThemeContext {
  theme: ThemeText
}
