import {createElement} from '..'
import {Parser} from '../type'

export const headingParser: Parser = ({parseElements}) => {
  return {
    regex: /^(#{1,6}) (.+)$/gm,
    replacer: (id, _, hashes: string, content: string) => {
      const type = `h${hashes.length}` as 'h1'

      return createElement(type, parseElements(content), id)
    },
  }
}
