import {createElement} from '..'
import {Parser} from '../type'

export const listParser: Parser<'listParser'> = ({parseElements}) => {
  return {
    regex: /^[-*+] (.+)$/gm,
    replacer: (id, _, content: string) =>
      createElement('li', parseElements(content), id),
  }
}
