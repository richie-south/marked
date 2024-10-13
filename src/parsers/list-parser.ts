import {createElement} from '..'
import {Parser} from '../type'

export const listParser: Parser = ({parseElements}) => {
  return {
    regex: /^[-*+] (.+)$/gm,
    replacer: (id, _, content: string) => {
      return createElement('li', parseElements(content), id)
    },
  }
}
