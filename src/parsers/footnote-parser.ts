import {createElement} from '..'
import {Parser} from '../type'

export const footnoteParser: Parser<'footnote'> = () => {
  return {
    regex: /\[(\^)([^\]]+?)](:{0,1})/g,
    replacer: (id, _, __, content, colon) => {
      if (colon) {
        return createElement('footnote', id, [content], {end: true})
      }

      return createElement('footnote', id, [content])
    },
  }
}
