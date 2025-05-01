/**
 * Hash를 Pathname 및 Query string으로 만들어 주는 함수
 *
 * @param url URL
 * @example
 * // returns URL {
 * //   protocol: 'https:'
 * //   host: 'example.com'
 * //   origin: 'https://example.com',
 * //   pathname: '/article/hello-world',
 * //   search: '?ref=recommended_section',
 * //   searchParams: URLSearchParams {
 * //     ref: 'recommended_section'
 * //   },
 * //   ...
 * // }
 * getHashUrl('https://example.com/#/article/hello-world?ref=recommended_section')
 */
export const parseHashUrl = (url: string | URL): URL => {
  const inUrl = new URL(url)
  const hashPathnameQuery = inUrl.hash.slice(1)

  if (!hashPathnameQuery.startsWith('/')) {
    throw new Error("could not start with '/'")
  }

  return new URL(inUrl.origin + hashPathnameQuery)
}
