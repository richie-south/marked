import {createElement} from '..'
import {Parser} from '../type'

export const blockquoteParser: Parser<'blockquoteParser'> = ({
  parseElements,
}) => {
  return {
    regex: /^> (.+)$/gm,
    replacer: (id, _, content: string) =>
      createElement('blockquote', parseElements(content), id),
  }
}
