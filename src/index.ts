import {Match, Parser} from './type'

/**
 * Creates an object representing an HTML element with optional attributes and children.
 */
export const createElement = (
  type: Match['type'],
  value: Match['value'],
  _id: number,
  attributes = {},
): Match =>
  ({
    type,
    _id,
    value,
    ...attributes,
  } as Match)

const parseElements = (
  text: string,
  parsers: Parser[],
  elem: (string | Match)[] = [],
) => {
  let elements: (string | Match)[] = []
  const tmp: (string | Match)[] = elem

  /**
   * split by markes and push back text pr parsed elements
   */
  const getInlineFromPart = (value: string) => {
    const elem: (string | Match)[] = []
    value.split(/(\\\d+)/g).forEach((part) => {
      if (part.startsWith('\\')) {
        const id = parseInt(part.slice(1))

        const item = tmp.find((a) => typeof a !== 'string' && a._id === id)
        item ? elem.push(item) : elem.push(tmp[parseInt(part.slice(1))])
      } else if (part) {
        elem.push(part)
      }
    })

    return elem
  }

  const pE = (text: string, elem: (string | Match)[] = []) =>
    parseElements(text, parsers, elem)

  for (let index = 0; index < parsers.length; index++) {
    const parser = parsers[index]

    const p = parser({parseElements: pE, getInlineFromPart, tmp})
    text = text.replace(p.regex, p.replacer)
  }

  return elements.concat(getInlineFromPart(text))
}

export const parse = (text: string, parsers: Parser[]) =>
  parseElements(text, parsers)
