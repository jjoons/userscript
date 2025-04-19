import type { MonkeyUserScript } from 'vite-plugin-monkey'
import baseMetadata from '../userscript_metadata'

const generateMetadata = (metadata: MonkeyUserScript): MonkeyUserScript => {
  return {
    ...baseMetadata,
    ...metadata,
  }
}

export default generateMetadata
