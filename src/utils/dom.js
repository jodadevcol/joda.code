export function onSelect(selector = '', context = document) {
  if (selector === '' || selector === null) return

  return context.querySelector(selector)
}

export function onSelectAll(selector = '', context = document) {
  if (selector === '' || selector === null) return

  return context.querySelectorAll(selector)
}