import {createElement} from '..'
import {Parser} from '../type'

export const boldItalicParser: Parser<'em' | 'strong'> = ({
  parseElements,
  getInline,
}) => {
  return {
    regex: /([*_]{1,3})(.+?)\1/g,
    replacer: (id, match, marker: string, content: string) => {
      const markerLength = marker.length
      const hasMutlible = markerLength > 2

      // for example it can be both italic and bold
      if (hasMutlible) {
        // prefer em over strong
        const matchSubset = match.slice(1, -1)
        const elem = getInline(matchSubset)

        return createElement('em', id, parseElements(matchSubset, elem))
      }

      const type = markerLength === 1 ? 'em' : 'strong'
      const elem = getInline(content)

      return createElement(type, id, parseElements(content, elem))
    },
  }
}
