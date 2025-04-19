/**
 * URL에서 hostname을 추출하는 함수
 *
 * @param hostname Hostname 또는 URL
 * @returns
 */
const parsingHostname = (hostname: string | URL): string => {
  if (hostname instanceof URL) {
    return hostname.hostname
  }

  if (typeof hostname === 'string' && !/^https?:\/\//.test(hostname)) {
    hostname = 'http://' + hostname
  }

  const url = new URL(hostname)

  return url.hostname
}

/**
 * Favicon을 가져오는 URL을 반환하는 함수
 */
export const duckDuckGoApi = (urlOrHostname: string | URL): string => {
  const iconHostname = parsingHostname(urlOrHostname)

  return `https://icons.duckduckgo.com/ip3/${iconHostname}.ico`
}

/**
 * Favicon을 가져오는 URL을 반환하는 함수
 */
export const googleApi = (urlOrHostname: string | URL, sz?: number): string => {
  const params: Record<string, string> = {
    domain: parsingHostname(urlOrHostname),
  }

  if (sz && sz > 0) {
    params.sz = sz.toString()
  }

  return `https://www.google.com/s2/favicons?${new URLSearchParams(params)}`
}
