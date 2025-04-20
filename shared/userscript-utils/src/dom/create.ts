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
