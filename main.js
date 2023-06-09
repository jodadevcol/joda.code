import Split from 'split-grid'
import { encode, decode } from 'js-base64'
import * as monaco from 'monaco-editor'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import { onSelect } from './src/utils/dom'
import './style.css'

window.MonacoEnvironment = {
  getWorker: (workerId, label) => {
    if (label === 'html') return new HtmlWorker()
    if (label === 'css') return new CssWorker()
    if (label === 'javascript') return new JsWorker()
  }
}

Split({
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

const { pathname } = window.location
const decodePathname = decode(pathname.slice(1))
const [partHTML, partCSS, partJS] = decodePathname.split('|')

const createOutput = () => {
  const valueHTML = editorHTML.getValue()
  const valueCSS = editorCSS.getValue()
  const valueJS = editorJS.getValue()

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

const updatedOutput = () => {
  const valueHTML = editorHTML.getValue()
  const valueCSS = editorCSS.getValue()
  const valueJS = editorJS.getValue()

  const hashedCode = `${valueHTML}|${valueCSS}|${valueJS}`
  const encodeCode = encode(hashedCode)
  window.history.replaceState(null, null, `/${encodeCode}`)

  const outputHTML = createOutput()
  onOutput.setAttribute('srcdoc', outputHTML)
}

const COMMON_EDITOR_OPTIONS = {
  automaticLayout: true, fontSize: 16, theme: 'vs-dark'
}

const editorHTML = monaco.editor.create(onHTML, {
  ...COMMON_EDITOR_OPTIONS, value: partHTML, language: 'html'
})

const editorCSS = monaco.editor.create(onCSS, {
  ...COMMON_EDITOR_OPTIONS, value: partCSS, language: 'css'
})

const editorJS = monaco.editor.create(onJS, {
  ...COMMON_EDITOR_OPTIONS, value: partJS, language: 'javascript'
})

editorHTML.onDidChangeModelContent(updatedOutput)
editorCSS.onDidChangeModelContent(updatedOutput)
editorJS.onDidChangeModelContent(updatedOutput)

const outputHTML = createOutput()
onOutput.setAttribute('srcdoc', outputHTML)
