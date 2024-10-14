import {createElement} from '..'
import {Parser} from '../type'

export const linkParser: Parser<'linkParser'> = ({
  parseElements,
  getInlineFromPart,
}) => {
  return {
    regex: /!?\[([^\]]+)]\((.*?)\)/g,
    replacer: (id, match, content: string, url: string) => {
      if (match.startsWith('!')) {
        return createElement('img', [''], id, {src: url, alt: content})
      }

      const elem = getInlineFromPart(content)
      return createElement('a', parseElements(content, elem), id, {
        href: url,
      })
    },
  }
}
