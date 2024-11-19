import {createElement} from '..'
import {Parser} from '../type'

export const linkParser: Parser<'a' | 'img'> = ({parseElements, getInline}) => {
  return {
    regex: /!?\[([^\]]+)]\((.*?)\)/g,
    ignore: ['linkParser'],
    replacer: (id, match, content: string, url: string) => {
      if (match.startsWith('!')) {
        return createElement('img', id, [''], {src: url, alt: content})
      }

      const elem = getInline(content)
      return createElement('a', id, parseElements(content, elem), {
        href: url,
      })
    },
  }
}
