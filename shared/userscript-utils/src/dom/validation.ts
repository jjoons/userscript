export const checkSelectorValid = (selector: string): void | never => {
  document.createDocumentFragment().querySelector(selector)
}

export const isSelectorValid = (selector: string) => {
  try {
    checkSelectorValid(selector)
  } catch {
    return false
  }

  return true
}
