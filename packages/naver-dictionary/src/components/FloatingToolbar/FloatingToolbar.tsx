import { Icon } from '@iconify/react'
import { useContext } from 'preact/hooks'
import { SettingsContext } from '../../context'
import style from './style.module.scss'

const ICON_SIZE = 20

const FloatingToolbar: preact.FunctionComponent = () => {
  const settingsContext = useContext(SettingsContext)

  const scrollToTop = () => {
    scroll({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={style.toolbarWrap}>
      <div className={style.toolbar}>
        {/*
        <button type="button" class={style.button} onClick={settingsContext.open}>
          <Icon icon="tabler:settings" width={ICON_SIZE} height={ICON_SIZE} />
        </button>
        */}

        <button type="button" class={style.button} onClick={scrollToTop}>
          <Icon icon="carbon:up-to-top" width={ICON_SIZE} height={ICON_SIZE} />
        </button>
      </div>
    </div>
  )
}

export default FloatingToolbar
