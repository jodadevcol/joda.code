import Split from 'split-grid'
import { encode, decode } from 'js-base64'

import { onSelect } from './src/utils/dom'
import './style.css'

Split({
  snapOffset: 10,
  columnGutters: [{
    track: 1,
    element: document.querySelector('.gutter-col-1')
  }],
  rowGutters: [{
    track: 1,
    element: document.querySelector('.gutter-row-1')
  }]
})

const onJS = onSelect('#codeJS')
const onCSS = onSelect('#codeCSS')
const onHTML = onSelect('#codeHTML')
const onOutput = onSelect('#outputHTML')

const createOutput = () => {
  const valueHTML = onHTML.value
  const valueCSS = onCSS.value
  const valueJS = onJS.value

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>${valueCSS}</style>
      </head>
      <body>
        ${valueHTML}
        <script>${valueJS}</script>
      </body>
    </html>
  `
}

const initOutput = () => {
  const { pathname } = window.location
  if (pathname === '/') return

  const decodePathname = decode(pathname.slice(1))
  const [partHTML, partCSS, partJS] = decodePathname.split('|')

  onHTML.value = partHTML
  onCSS.value = partCSS
  onJS.value = partJS

  const outputHTML = createOutput()
  onOutput.setAttribute('srcdoc', outputHTML)
}

const updatedOutput = () => {
  const valueHTML = onHTML.value
  const valueCSS = onCSS.value
  const valueJS = onJS.value

  const hashedCode = `${valueHTML}|${valueCSS}|${valueJS}`
  const encodeCode = encode(hashedCode)
  window.history.replaceState(null, null, `/${encodeCode}`)

  const outputHTML = createOutput()
  onOutput.setAttribute('srcdoc', outputHTML)
}

onJS.addEventListener('input', updatedOutput)
onCSS.addEventListener('input', updatedOutput)
onHTML.addEventListener('input', updatedOutput)

initOutput()
