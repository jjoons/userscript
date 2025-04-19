/**
 * {@linkcode XPathResult} 객체에서 {@linkcode E}를 꺼내서 `Array`에 담는 유틸 함수
 *
 * @param xPathResult {@linkcode XPathResult} 객체
 * @example
 * const xPathResult = document.evaluate(
 *   '//*[contains(@class, "item"])',
 *   document.body,
 *   null,
 *   XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
 *   null,
 * )
 *
 * // returns [div.item, div.item, /* ...]
 * xPathResultToArray(xPathResult)
 */
export const xPathResultToArray = <E extends Node>(
  xPathResult: XPathResult,
): E[] => {
  const nodes: E[] = []

  switch (xPathResult.resultType) {
    case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
    case XPathResult.UNORDERED_NODE_ITERATOR_TYPE: {
      let item: E | null

      while ((item = xPathResult.iterateNext() as E | null) !== null) {
        nodes.push(item)
      }

      break
    }

    case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
    case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE: {
      for (let i = 0; i < xPathResult.snapshotLength; i++) {
        const item = xPathResult.snapshotItem(i) as E
        nodes.push(item)
      }

      break
    }

    default: {
      throw new Error('Only support snapshot or iterator type')
    }
  }

  return nodes
}

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
  timeout: number = 10000,
): Promise<E | null> => {
  return new Promise((resolve, reject) => {
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

/**
 * 여러 개의 Element({@linkcode T})를 생성하는 함수
 *
 * @param tagName 태그 이름
 * @param count 생성할 Element의 개수
 * @param options {@linkcode ElementCreationOptions}
 * @returns 지정한 개수만큼 Element가 담긴 배열
 */
export const createElements = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  count: number,
  options?: ElementCreationOptions,
) =>
  Array.from({ length: count }, () =>
    document.createElement<T>(tagName, options),
  )
