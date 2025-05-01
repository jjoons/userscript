import { SettingsProvider } from './SettingsProvider'
import { ThemeProvider } from './ThemeProvider'

export const AppProviders: preact.FunctionComponent = ({ children }) => {
  return (
    <ThemeProvider>
      <SettingsProvider>{children}</SettingsProvider>
    </ThemeProvider>
  )
}
