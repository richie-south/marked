import {createElement} from '..'
import {Parser} from '../type'

export const strikeParser: Parser<'s'> = ({parseElements, getInline}) => {
  return {
    regex: /(~{2})((.|\n)+?)\1/g,
    replacer: (id, _, __: string, content: string) => {
      const elem = getInline(content)

      return createElement('s', parseElements(content, elem), id)
    },
  }
}
