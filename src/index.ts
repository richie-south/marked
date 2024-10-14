import {Match, Parser} from './type'

/**
 * Creates an object representing an HTML element with optional attributes and children.
 */
export const createElement = <T>(
  type: Match['type'],
  value: Match['value'],
  _id: number,
  attributes = {},
): Match<T> =>
  ({
    type,
    _id,
    value,
    ...attributes,
  } as Match<T>)

const parseElements = <T>(
  text: string,
  parsers: Parser<T>[],
  elem: (string | Match<T>)[] = [],
) => {
  const tmp: (string | Match<T>)[] = elem

  /**
   * split by markes and push back text pr parsed elements
   */
  const getInlineFromPart = (value: string) => {
    const elem: (string | Match<T>)[] = []
    value.split(/(\\\d+)/g).forEach((part) => {
      if (part.startsWith('\\')) {
        const id = parseInt(part.slice(1))

        elem.push(tmp.find((a: Match<T>) => a._id === id))
      } else if (part) {
        elem.push(part)
      }
    })

    return elem
  }

  const pE = (text: string, elem: (string | Match<T>)[] = []) =>
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

export const parse = <T>(text: string, parsers: Parser<T>[]) =>
  parseElements(text, parsers)
