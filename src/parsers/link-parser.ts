import {createElement} from '..'
import {Parser} from '../type'

export const linkParser: Parser = ({parseElements, getInlineFromPart, tmp}) => {
  return {
    regex: /!?\[([^\]]+)]\((.*?)\)/g,
    replacer: (match, content: string, url: string) => {
      const elem = getInlineFromPart(content)

      if (match.startsWith('!')) {
        tmp.push(
          createElement('img', [''], tmp.length, {src: url, alt: content}),
        )
      } else {
        tmp.push(
          createElement('a', parseElements(content, elem), tmp.length, {
            href: url,
          }),
        )
      }
      return `\\${tmp.length - 1}`
    },
  }
}
