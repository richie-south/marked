import {createElement} from '..'
import {Parser} from '../type'

export const blockParser: Parser<'code'> = ({parseElements}) => {
  return {
    regex: /(`{3,}|~{3,})([\s\S]*?)\1|(`)(.+?)\3/g,
    replacer: (id, match, caret, content) => {
      // fenced (multi ticks)
      if (caret) {
        return createElement('code', parseElements(content), id)
      }

      return createElement('code', parseElements(match.slice(1, -1)), id)
    },
  }
}
