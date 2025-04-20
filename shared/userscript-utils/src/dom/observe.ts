import { isBlank } from '../strings'

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
