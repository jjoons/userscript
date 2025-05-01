import { useContext } from 'preact/hooks'
import FloatingToolbar from './components/FloatingToolbar'
import SettingsPanel from './components/SettingsPanel'
import { ThemeContext } from './context/ThemeProvider'

const App: preact.FunctionComponent = () => {
  const themeContext = useContext(ThemeContext)

  return (
    <div id="us_n_dict_wrap" data-theme={themeContext.theme}>
      <SettingsPanel />
      <FloatingToolbar />
    </div>
  )
}

export default App
