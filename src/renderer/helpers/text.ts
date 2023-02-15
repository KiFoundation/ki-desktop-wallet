export function capitalize(s: string): string {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export const truncate = (str: string, nbChars: number, separator = '...'): string => {
  return str.slice(0, Math.ceil(nbChars / 2)) + separator + str.slice(str.length - Math.floor(nbChars / 2))
}
