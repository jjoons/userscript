import { Icon } from '@iconify/react'
import { useContext } from 'preact/hooks'
import { SettingsContext } from '../../context'
import style from './style.module.scss'

const SettingsPanel: preact.FunctionComponent = () => {
  const settingsContext = useContext(SettingsContext)

  const onClose = () => {
    settingsContext.close()
  }

  return (
    <>
      {settingsContext.isOpen && (
        <div className={style.popupWrap}>
          <div className={style.popup}>
            <div className={style.popupHeader}>
              <div className={style.popupTitle}>설정</div>
              <button type="button" onClick={onClose} className={style.closeButton}>
                <Icon icon="material-symbols-light:close" width={28} height={28} />
              </button>
            </div>
            <div className={style.popupContents}>
              <div>구현 예정</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SettingsPanel
