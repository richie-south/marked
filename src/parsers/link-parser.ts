import {createElement} from '..'
import {Parser} from '../type'

export const linkParser: Parser = ({parseElements, getInlineFromPart}) => {
  return {
    regex: /!?\[([^\]]+)]\((.*?)\)/g,
    replacer: (id, match, content: string, url: string) => {
      const elem = getInlineFromPart(content)

      if (match.startsWith('!')) {
        return createElement('img', [''], id, {src: url, alt: content})
      }

      return createElement('a', parseElements(content, elem), id, {
        href: url,
      })
    },
  }
}
