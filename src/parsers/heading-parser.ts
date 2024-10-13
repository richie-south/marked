import {createElement} from '..'
import {Parser} from '../type'

export const headingParser: Parser = ({parseElements, tmp}) => {
  return {
    regex: /^(#{1,6}) (.+)$/gm,
    replacer: (_, hashes: string, content: string) => {
      const type = `h${hashes.length}` as 'h1'

      tmp.push(createElement(type, parseElements(content), tmp.length))
      return `\\${tmp.length - 1}`
    },
  }
}
