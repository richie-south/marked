import {createElement} from '..'
import {Parser} from '../type'

export const listParser: Parser = ({parseElements, tmp}) => {
  return {
    regex: /^[-*+] (.+)$/gm,
    replacer: (_, content: string) => {
      tmp.push(createElement('li', parseElements(content), tmp.length))
      return `\\${tmp.length - 1}`
    },
  }
}
