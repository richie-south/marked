import {createElement} from '..'
import {Parser} from '../type'

type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export const headingParser: Parser<Headings> = ({parseElements}) => {
  return {
    regex: /^(#{1,6}) (.+)$/gm,
    replacer: (id, _, hashes: string, content: string) => {
      const type = `h${hashes.length}` as Headings

      return createElement(type, id, parseElements(content))
    },
  }
}
