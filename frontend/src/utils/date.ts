export const formatDateBR = (isoDate: string) => {
  if (!isoDate) return ''
  const dateStr = isoDate.split('.')[0] + 'Z'
  const date = new Date(dateStr)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Sao_Paulo'
  })
}