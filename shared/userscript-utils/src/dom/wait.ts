export const WAIT_FOR_ELEMENT_DEFAULT_TIMEOUT = 10_000

/**
 * Selector를 이용해 `Element`를 찾는 함수. 지정한 시간를 초과할 경우 `null` 반환.
 *
 * @param selector Selector
 * @param timeout Element를 찾을 시간
 */
// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
// https://medium.com/@ryan_forrester_/javascript-wait-for-element-to-exist-simple-explanation-1cd8c569e354
export const waitForElement = <E extends Element = Element>(
  selector: string,
  timeout: number = WAIT_FOR_ELEMENT_DEFAULT_TIMEOUT,
): Promise<E | null> => {
  return new Promise((resolve) => {
    const el = document.querySelector<E>(selector)
    if (el) return resolve(el)

    let observer: MutationObserver | null = null

    const timeoutNumber = setTimeout(() => {
      observer?.disconnect()
      resolve(null)
    }, timeout)

    observer = new MutationObserver((muts, obs) => {
      const el = document.querySelector<E>(selector)

      if (el) {
        obs.disconnect()
        clearTimeout(timeoutNumber)
        resolve(el)
      }
    })

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })
  })
}
