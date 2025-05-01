import { createContext } from 'preact'
import { useState } from 'preact/hooks'

export const SettingsContext = createContext<ISettingsContext>({
  isOpen: false,
  open: () => {},
  close: () => {},
})

/**
 * 설정창 및 설정을 제어하는 Provider
 */
export const SettingsProvider: preact.FunctionComponent = ({ children }) => {
  const [isOpen, setOpen] = useState<boolean>(false)

  const open = () => {
    if (!isOpen) {
      setOpen(true)
      document.body.style.overflow = 'hidden'
    }
  }

  const close = () => {
    if (isOpen) {
      setOpen(false)
      document.body.style.overflow = ''
    }
  }

  return (
    <SettingsContext.Provider value={{ isOpen, open, close }}>{children}</SettingsContext.Provider>
  )
}

interface ISettingsContext {
  /** 설정창 오픈 여부 */
  readonly isOpen: boolean
  /** 설정창 여는 함수 */
  open: () => void
  /** 설정창 닫는 함수 */
  close: () => void
}
