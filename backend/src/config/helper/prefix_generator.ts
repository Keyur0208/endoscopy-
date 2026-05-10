export function generatePrefix(name: string, length: number = 4): string {
  const words = name.trim().split(/\s+/)
  let prefix = ''

  if (words.length >= length) {
    prefix = words
      .map((w) => w[0])
      .join('')
      .substring(0, length)
  } else {
    prefix = name.replace(/\s+/g, '').substring(0, length)
  }

  return prefix.toUpperCase()
}
