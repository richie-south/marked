import {createElement} from '..'
import {Parser} from '../type'

export const breaklinesParser: Parser = () => {
  return {
    regex: /(\r\n|\n|\r|<br\/>)/gm,
    replacer: (id, _, content: string) => {
      return createElement('br', [content], id)
    },
  }
}
