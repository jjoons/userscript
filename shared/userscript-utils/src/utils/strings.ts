export const isEmpty = (str: string) => str.length === 0

/**
 * {@linkcode String.trim()}한 이후 문자열이 있는지 없는지 확인하는 함수
 *
 * @param str 확인할 문자열
 * @returns 비어있는 문자면 `true`
 */
export const isBlank = (str: string): boolean => {
  if (isEmpty(str)) return true

  return str.trim().length === 0
}
