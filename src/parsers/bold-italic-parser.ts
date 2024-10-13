import {createElement} from '..'
import {Parser} from '../type'

export const boldItalicParser: Parser = ({
  parseElements,
  getInlineFromPart,
  tmp,
}) => {
  return {
    regex: /([*_]{1,3})(.+?)\1/g,
    replacer: (match, marker: string, content: string) => {
      const markerLength = marker.length
      const hasMutlible = markerLength > 2

      // example both italic bold
      if (hasMutlible) {
        // prefer em over strong
        const matchSubset = match.slice(1, -1)
        const elem = getInlineFromPart(matchSubset)

        tmp.push(
          createElement('em', parseElements(matchSubset, elem), tmp.length),
        )
        return `\\${tmp.length - 1}`
      }

      const type = markerLength === 1 ? 'em' : 'strong'
      const elem = getInlineFromPart(content)

      tmp.push(createElement(type, parseElements(content, elem), tmp.length))
      return `\\${tmp.length - 1}`
    },
  }
}
