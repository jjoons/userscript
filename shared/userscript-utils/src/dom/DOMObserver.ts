import { isBlank } from '../strings'

/**
 * {@linkcode MutationObserver}를 이용해 DOM 변화를 감지하는 클래스
 */
export class DOMObserver {
  static readonly #DEFAULT_BASE_NODE: Node = document.body
  static #instances: DOMObserver[] = []
  readonly #observer: MutationObserver
  /** 변경 사항을 감지할 `Node` */
  readonly #baseNode: Node
  #isStarted = false
  #subscribers: DOMObserverSubscribe[] = []

  /**
   *
   */
  private constructor(options: DOMObserverConstructorOptions) {
    this.#observer = new MutationObserver(this.#mutationCallback.bind(this))
    this.#baseNode = options.baseNode
  }

  /**
   * {@linkcode DOMObserver} 클래스를 만들 때 사용되는 정적 메소드
   *
   * @param options 인스턴스를 생성할 때 사용하는 옵션
   */
  public static getInstance(
    options: DOMObserverGetInstanceOptions = {},
  ): DOMObserver {
    const { baseNode = this.#DEFAULT_BASE_NODE } = options

    for (const ins of this.#instances) {
      if (ins.#baseNode === baseNode) {
        return ins
      }
    }

    const ins = new this({ baseNode })
    this.#instances.push(ins)

    return ins
  }

  /**
   * `Element` 감지를 위해 구독하는 메소드
   *
   * @param options 모니터링할 때 사용하는 옵션
   * @returns
   */
  public subscribe<E extends Element = Element>(
    options: DOMObserverSubscribe<E>,
  ): DOMObserverSubscribeController {
    const { selector, onAdd, onRemove, onAttribute } = options

    if (selector && isBlank(selector)) throw new Error('Selector is blank')

    if (onAdd || onRemove || onAttribute) {
      throw new Error('You must register at least one type of listener')
    }

    this.#subscribers.push(options)

    if (!this.#isStarted) {
      this.#start()
    }

    return {
      unsubscribe: () => {
        const subscriberIndex = this.#subscribers.indexOf(options)

        if (subscriberIndex >= 0) {
          this.#subscribers.splice(subscriberIndex, 1)
        }

        this.#removeThisInstanceIfInactive()
      },
    }
  }

  /**
   * {@linkcode MutationObserver} Callback 함수
   *
   * @param muts
   */
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

  /**
   * `MutationObserver`를 시작하는 메소드
   */
  #start() {
    this.#observer.observe(this.#baseNode, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
    })

    this.#isStarted = true
  }

  /**
   * `MutationObserver`를 정지하는 메소드
   */
  #stop() {
    this.#observer.disconnect()

    this.#isStarted = false
  }

  /**
   * 조건에 해당하는지 확인한 다음 인스턴스 모음 객체에서 인스턴스를 삭제하는 메소드 실행
   *
   * @returns 삭제 조건에 해당할 경우 `true` 반환
   */
  #removeThisInstanceIfInactive(): boolean {
    if (this.#subscribers.length > 0) return false

    return this.#removeThisInstance()
  }

  /**
   * 인스턴스 모음 객체에서 인스턴스를 제거하는 메소드
   *
   * @returns 삭제되었을 경우 `true` 반환
   */
  #removeThisInstance(): boolean {
    this.#stop()

    const index = DOMObserver.#instances.indexOf(this)
    if (index < 0) return false

    const deletedInstances = DOMObserver.#instances.splice(index, 1)

    return deletedInstances.length === 1
  }
}

/** `DOMObserver` `Constructor` 파라미터 옵션  */
interface DOMObserverConstructorOptions {
  baseNode: Node
}

/** `DOMObserver` `getInstance` 파라미터 옵션 */
interface DOMObserverGetInstanceOptions {
  baseNode?: Node
}

/**
 * 구독을 등록할 떄 사용하는 객체
 */
interface DOMObserverSubscribe<E extends Element = Element> {
  /** CSS 선택자 */
  selector: string | null
  /**
   * 얼마나 깊이 찾을지(재귀적으로 탐색할 지) 지정하는 옵션.
   * 각 Callback 별로 다르게 설정할 수 있음
   */
  deep?: {
    add?: DOMObserverDeepValue
    remove?: DOMObserverDeepValue
    attribute?: DOMObserverDeepValue
  }
  /** `Node`가 추가되었을 때 호출되는 Callback */
  onAdd?(event: DOMObserverEvent<E>): void
  /** `Node`가 삭제되었을 때 호출되는 Callback */
  onRemove?(event: DOMObserverEvent<E>): void
  /** Attribute 변경이 감지되었을 떄 실행되는 Callback */
  onAttribute?(event: DOMObserverAttrCharDataEvent<E>): void
}

/**
 * `single`: {@linkcode Element.querySelector}를 사용하여 한 번만 찾고 존재하면 재귀적으로 탐색
 *
 * `all`: {@linkcode Element.querySelectorAll}을 사용하여 재귀적으로 탐색한 다음,
 * 조건에 일치하는 모든 `Element`를 Callback 실행
 */
type DOMObserverDeepValue = 'single' | 'all'

interface DOMObserverSubscribeController {
  unsubscribe(): void
}

/**
 * DOM 추가 및 삭제 등이 감지되었을 때 Callback 파라미터로 전달되는 객체
 */
interface DOMObserverEvent<E extends Element = Element> {
  node: E
  deep?: DOMObserverDeepValue
}

/**
 * Attribute, CharacterData 변경 이벤트가 감지되었을 때 전달되는 객체
 */
interface DOMObserverAttrCharDataEvent<E extends Element = Element>
  extends DOMObserverEvent<E> {
  value: string | null
  oldValue: string | null
}
