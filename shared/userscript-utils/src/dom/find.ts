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
 * // returns [div.item.entry, div.item.item_b, /* ...]
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
