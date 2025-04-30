import { isBlank } from '../strings'

/**
 * 지정한 Selector에 일치하는 Element가 변경되었을 경우 Callback으로 변경된 `Element` 전송.
 *
 * Callback을 지정한 변수만 로직이 작동되도록 설계.
 *
 * @param selector CSS Selector. `null`일 경우 Selector와 상관없이 Callback 실행
 * @param options 기준이 되는 `Node` 및 Callback 등을 정의하는 객체
 * @returns
 */
export const observeElement = <E extends Element = Element>(
  selector: string | null,
  {
    baseNode = document.body,
    recursive = {},
    onAdd,
    onRemove,
    onAttribute,
  }: ObserveElementOptions<E>,
): ObserveElementControl => {
  if (selector && isBlank(selector)) throw new Error('selector is blank')

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
              if (selector) {
                if (addedNode.matches(selector)) {
                  onAdd({ node: addedNode as E })
                } else if (recursive.add === 'single') {
                  const el = addedNode.querySelector<E>(selector)

                  if (el) onAdd({ node: el, recursive: recursive.add })
                } else if (recursive.add === 'all') {
                  for (const el of Array.from(addedNode.querySelectorAll<E>(selector))) {
                    onAdd({ node: el, recursive: recursive.add })
                  }
                }
              } else onAdd({ node: addedNode as E })
            }
          }
        }

        if (onRemove) {
          for (const removedNodes of Array.from(mut.removedNodes)) {
            if (removedNodes instanceof Element) {
              if (selector) {
                if (removedNodes.matches(selector)) {
                  onRemove({ node: removedNodes as E })
                } else if (recursive.remove === 'single') {
                  const el = removedNodes.querySelector<E>(selector)

                  if (el) onRemove({ node: el, recursive: recursive.remove })
                } else if (recursive.remove === 'all') {
                  for (const el of Array.from(removedNodes.querySelectorAll<E>(selector))) {
                    onRemove({ node: el, recursive: recursive.remove })
                  }
                }
              } else onRemove({ node: removedNodes as E })
            }
          }
        }
      } else if (mut.type === 'attributes' && onAttribute && mut.target instanceof Element) {
        if (selector) {
          if (mut.target.matches(selector)) {
            onAttribute({
              node: mut.target as E,
              value: mut.attributeName,
              oldValue: mut.oldValue,
            })
          } else if (recursive.attribute === 'single') {
            const el = mut.target.querySelector<E>(selector)

            if (el)
              onAttribute({
                node: el,
                recursive: recursive.attribute,
                value: mut.attributeName,
                oldValue: mut.oldValue,
              })
          } else if (recursive.attribute === 'all') {
            for (const el of Array.from(mut.target.querySelectorAll<E>(selector))) {
              onAttribute({
                node: el,
                recursive: recursive.attribute,
                value: mut.attributeName,
                oldValue: mut.oldValue,
              })
            }
          }
        } else
          onAttribute({
            node: mut.target as E,
            value: mut.attributeName,
            oldValue: mut.oldValue,
          })
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
  /**
   * 탐색 기준이 되는 `Node`
   */
  baseNode?: Node
  recursive?: {
    add?: ObserveElementOptionsRecursiveValue
    remove?: ObserveElementOptionsRecursiveValue
    attribute?: ObserveElementOptionsRecursiveValue
  }
  onAdd?(event: ObserveElementEvent<E>): void
  onRemove?(event: ObserveElementEvent<E>): void
  onAttribute?(event: ObserveElementAttrCharDataEvent<E>): void
  // onCharacterData?(node: E): void
}

interface ObserveElementControl {
  start(): void
  stop(): void
  get isStarted(): boolean
}

type ObserveElementOptionsRecursiveValue = 'single' | 'all'

interface ObserveElementEvent<E extends Element = Element> {
  node: E
  recursive?: ObserveElementOptionsRecursiveValue
}

interface ObserveElementAttrCharDataEvent<E extends Element = Element>
  extends ObserveElementEvent<E> {
  value: string | null
  oldValue: string | null
}
