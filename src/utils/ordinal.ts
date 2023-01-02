export function ordinal(num: number): string {
  num = Math.round(num)
  const numString = num.toString()

  if (Math.floor(num / 10) % 10 === 1) {
    return numString + 'th'
  }

  switch (num % 10) {
    case 1:
      return numString + 'st'
    case 2:
      return numString + 'nd'
    case 3:
      return numString + 'rd'
    default:
      return numString + 'th'
  }
}
