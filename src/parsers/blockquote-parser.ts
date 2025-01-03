import {createElement} from '..'
import {Parser} from '../type'

export const blockquoteParser: Parser<'blockquote'> = ({parseElements}) => {
  return {
    regex: /^> (.+)$/gm,
    replacer: (id, _, content: string) =>
      createElement('blockquote', id, parseElements(content)),
  }
}
