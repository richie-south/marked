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
  const tmp: (string | Match)[] = elem

  /**
   * split by markes and push back text pr parsed elements
   */
  const getInlineFromPart = (value: string) => {
    const elem: (string | Match)[] = []
    value.split(/(\\\d+)/g).forEach((part) => {
      if (part.startsWith('\\')) {
        const id = parseInt(part.slice(1))

        elem.push(tmp.find((a: Match) => a._id === id))
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

    const p = parser({parseElements: pE, getInlineFromPart})
    text = text.replace(p.regex, (...args) => {
      tmp.push(p.replacer(tmp.length, ...args))

      return `\\${tmp.length - 1}`
    })
  }

  return getInlineFromPart(text)
}

export const parse = (text: string, parsers: Parser[]) =>
  parseElements(text, parsers)
