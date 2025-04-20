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
