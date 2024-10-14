import {createElement} from '..'
import {Parser} from '../type'

export const headingParser: Parser<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = ({
  parseElements,
}) => {
  return {
    regex: /^(#{1,6}) (.+)$/gm,
    replacer: (id, _, hashes: string, content: string) => {
      const type = `h${hashes.length}` as 'h1'

      return createElement(type, parseElements(content), id)
    },
  }
}
