import {createElement} from '..'
import {Parser} from '../type'

export const boldItalicParser: Parser = ({
  parseElements,
  getInlineFromPart,
  tmp,
}) => {
  return {
    regex: /([*_]{1,3})(.+?)\1/g,
    replacer: (_, marker: string, content: string) => {
      const type = marker.length === 1 ? 'em' : 'strong'
      const elem = getInlineFromPart(content)

      tmp.push(createElement(type, parseElements(content, elem), tmp.length))
      return `\\${tmp.length - 1}`
    },
  }
}
