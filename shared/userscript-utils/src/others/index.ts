export const wait = (delay: number) =>
  new Promise((resolve) => void setTimeout(resolve, delay))
