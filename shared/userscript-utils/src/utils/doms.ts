import { isBlank } from './strings'

export const WAIT_FOR_ELEMENT_DEFAULT_TIMEOUT = 10_000

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
 * XPath Expression을 이용해 지정된 Node를 찾는 함수
 *
 * @param expression XPath Expression
 * @param node 탐색의 기준이 되는 `Node`. 지정하면 해당 `Node`를 기준으로 탐색
 */
export const getNodeByXPathExpression = <E extends Node = Node>(
  expression: string,
  node: Node = document,
): E | null =>
  document.evaluate(
    expression,
    node,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as E | null

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

/**
 * 지정한 Selector에 일치하는 Element가 변경되었을 경우 Callback으로 변경된 `Element` 전송.
 *
 * Callback을 지정한 변수만 로직이 작동되도록 설계.
 *
 * @param selector CSS Selector
 * @param options 기준이 되는 `Node` 및 Callback 등을 정의하는 객체
 * @returns
 */
export const observeElement = <E extends Element = Element>(
  selector: string,
  {
    baseNode = document.body,
    onAdd,
    onRemove,
    onAttribute,
  }: ObserveElementOptions<E>,
): ObserveElementControl => {
  if (isBlank(selector)) throw new Error('selector is blank')

  let isStarted = false
  const observerOptions: MutationObserverInit = {}

  if (onAdd || onRemove) {
    observerOptions.childList = true
    observerOptions.subtree = true
  }

  if (onAttribute) {
    observerOptions.attributes = true
    observerOptions.attributeOldValue = true
  }

  const observer = new MutationObserver((muts) => {
    for (const mut of muts) {
      if (mut.type === 'childList') {
        if (onAdd) {
          for (const addedNode of Array.from(mut.addedNodes)) {
            if (addedNode instanceof Element) {
              if (addedNode.matches(selector)) {
                onAdd(addedNode as E)
              } else {
                const el = addedNode.querySelector(selector)

                if (el) {
                  onAdd(el as E)
                }
              }
            }
          }
        }

        if (onRemove) {
          for (const removedNodes of Array.from(mut.removedNodes)) {
            if (removedNodes instanceof Element) {
              if (removedNodes.matches(selector)) {
                onRemove(removedNodes as E)
              } else {
                const el = removedNodes.querySelector(selector)

                if (el) {
                  onRemove(el as E)
                }
              }
            }
          }
        }
      } else if (
        mut.type === 'attributes' &&
        onAttribute &&
        mut.target instanceof Element
      ) {
        if (mut.target.matches(selector)) {
          onAttribute(mut.target as E, mut.attributeName!)
        } else {
          const el = mut.target.querySelector(selector)

          if (el) {
            onAttribute(mut.target as E, mut.attributeName!)
          }
        }
      }
    }
  })

  return {
    start() {
      observer.observe(baseNode, observerOptions)
      isStarted = true
    },
    stop() {
      observer.disconnect()
      isStarted = false
    },
    get isStarted(): boolean {
      return isStarted
    },
  }
}

interface ObserveElementOptions<E extends Element = Element> {
  baseNode?: Node
  onAdd?(node: E): void
  onRemove?(node: E): void
  onAttribute?(node: E, attribute: string): void
  onCharacterData?(node: E): void
}

interface ObserveElementControl {
  start(): void
  stop(): void
  get isStarted(): boolean
}
