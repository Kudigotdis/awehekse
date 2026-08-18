export function shareViaWhatsApp(title, text) {
  const message = encodeURIComponent(`${title ? `${title}\n\n` : ''}${text}`)
  const url = `https://wa.me/?text=${message}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
