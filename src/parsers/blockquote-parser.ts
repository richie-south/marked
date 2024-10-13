import {createElement} from '..'
import {Parser} from '../type'

export const blockquoteParser: Parser = ({parseElements, tmp}) => {
  return {
    regex: /^> (.+)$/gm,
    replacer: (_, content: string) => {
      tmp.push(createElement('blockquote', parseElements(content), tmp.length))
      return `\\${tmp.length - 1}`
    },
  }
}
