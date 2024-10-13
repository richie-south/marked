import {createElement} from '..'
import {Parser} from '../type'

export const breaklinesParser: Parser = ({tmp}) => {
  return {
    regex: /(\r\n|\n|\r|<br\/>)/gm,
    replacer: (_, content: string) => {
      tmp.push(createElement('br', [content], tmp.length))
      return `\\${tmp.length - 1}`
    },
  }
}
