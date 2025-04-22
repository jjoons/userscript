import { isBlank } from '../strings'

/**
 * {@link MutationObserver}
 */
export class DOMObserver {
  static #instance: DOMObserver
  #observer: MutationObserver
  /** 변경 사항을 감지할 `Node` */
  #baseNode: Node
  #isStarted = false
  #subscribers: DOMObserverSubscribe[] = []

  private constructor(options: DOMObserverConstructorOptions) {
    this.#observer = new MutationObserver(this.#mutationCallback.bind(this))
    this.#baseNode = options.baseNode
  }

  /**
   *
   * @param options 인스턴스를 생성할 때 사용하는 옵션
   */
  public static getInstance(
    options: DOMObserverGetInstanceOptions = {},
  ): DOMObserver {
    let { baseNode } = options

    if (!baseNode) {
      baseNode = document.body
    }

    if (!DOMObserver.#instance) {
      DOMObserver.#instance = new this({ baseNode })
    }

    return DOMObserver.#instance
  }

  #start() {
    this.#observer.observe(this.#baseNode, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
    })

    this.#isStarted = true
  }

  #stop() {
    this.#observer.disconnect()

    this.#isStarted = false
  }

  public subscribe(
    options: DOMObserverSubscribe,
  ): DOMObserverSubscribeController {
    const { selector, onAdd, onRemove, onAttribute } = options

    if (selector && isBlank(selector)) throw new Error('Selector is blank')

    if (onAdd || onRemove || onAttribute) {
      throw new Error('You must register at least one type of listener')
    }

    const subscriberIndex = this.#subscribers.push(options)

    if (!this.#isStarted) {
      this.#start()
    }

    return {
      unsubscribe: () => {
        this.#subscribers.splice(subscriberIndex, 1)

        if (this.#subscribers.length === 0) {
          this.#stop()
        }
      },
    }
  }

  #mutationCallback(muts: MutationRecord[]): void {
    for (const mut of muts) {
      if (mut.type === 'childList') {
        for (const addedNode of Array.from(mut.addedNodes)) {
          if (addedNode instanceof Element) {
            for (const { onAdd, selector, deep = {} } of this.#subscribers) {
              if (onAdd) {
                if (selector) {
                  if (addedNode.matches(selector)) {
                    onAdd({ node: addedNode })
                  } else if (deep.add === 'single') {
                    const el = addedNode.querySelector(selector)

                    if (el) onAdd({ node: el, deep: deep.add })
                  } else if (deep.add === 'all') {
                    for (const el of Array.from(
                      addedNode.querySelectorAll(selector),
                    )) {
                      onAdd({ node: el, deep: deep.add })
                    }
                  }
                } else onAdd({ node: addedNode })
              }
            }
          }
        }

        for (const removedNodes of Array.from(mut.removedNodes)) {
          if (removedNodes instanceof Element) {
            for (const { onRemove, selector, deep = {} } of this.#subscribers) {
              if (onRemove) {
                if (selector) {
                  if (removedNodes.matches(selector)) {
                    onRemove({ node: removedNodes })
                  } else if (deep.remove === 'single') {
                    const el = removedNodes.querySelector(selector)

                    if (el) onRemove({ node: el, deep: deep.remove })
                  } else if (deep.remove === 'all') {
                    for (const el of Array.from(
                      removedNodes.querySelectorAll(selector),
                    )) {
                      onRemove({ node: el, deep: deep.remove })
                    }
                  }
                } else onRemove({ node: removedNodes })
              }
            }
          }
        }
      } else if (mut.type === 'attributes' && mut.target instanceof Element) {
        for (const { onAttribute, selector, deep = {} } of this.#subscribers) {
          if (onAttribute) {
            if (selector) {
              if (mut.target.matches(selector)) {
                onAttribute({
                  node: mut.target,
                  value: mut.attributeName,
                  oldValue: mut.oldValue,
                })
              } else if (deep.attribute === 'single') {
                const el = mut.target.querySelector(selector)

                if (el)
                  onAttribute({
                    node: el,
                    value: mut.attributeName,
                    oldValue: mut.oldValue,
                    deep: deep.attribute,
                  })
              } else if (deep.attribute === 'all') {
                for (const el of Array.from(
                  mut.target.querySelectorAll(selector),
                )) {
                  onAttribute({
                    node: el,
                    value: mut.attributeName,
                    oldValue: mut.oldValue,
                    deep: deep.attribute,
                  })
                }
              }
            } else
              onAttribute({
                node: mut.target,
                value: mut.attributeName,
                oldValue: mut.oldValue,
              })
          }
        }
      }
    }
  }
}

interface DOMObserverConstructorOptions {
  baseNode: Node
}

interface DOMObserverGetInstanceOptions {
  baseNode?: Node
}

interface DOMObserverSubscribe<E extends Element = Element> {
  selector: string | null
  deep?: {
    add?: DOMObserverDeepValue
    remove?: DOMObserverDeepValue
    attribute?: DOMObserverDeepValue
  }
  onAdd?(event: DOMObserverEvent<E>): void
  onRemove?(event: DOMObserverEvent<E>): void
  onAttribute?(event: DOMObserverAttrCharDataEvent<E>): void
}

type DOMObserverDeepValue = 'single' | 'all'

interface DOMObserverSubscribeController {
  unsubscribe(): void
}

interface DOMObserverEvent<E extends Element = Element> {
  node: E
  deep?: DOMObserverDeepValue
}

interface DOMObserverAttrCharDataEvent<E extends Element = Element>
  extends DOMObserverEvent<E> {
  value: string | null
  oldValue: string | null
}
