import {createElement} from '..'
import {Parser} from '../type'

export const breaklinesParser: Parser<'br'> = () => {
  return {
    regex: /(\r\n|\n|\r|<br\/>)/gm,
    replacer: (id, _, content: string) => createElement('br', [content], id),
  }
}
