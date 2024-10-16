import {Match, Parser} from './type'

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
  text: string = '',
  parsers: Parser<T>[] = [],
  elem: (string | Match<T>)[] = [],
) => {
  const tmp: (string | Match<T>)[] = elem

  /**
   * split by markes and push back text pr parsed elements
   */
  const getInlineFromPart = (value: string) => {
    const elem: (string | Match<T>)[] = []

    const parts = value.split(/(\\{{\[tiny\d+\]}})/g)
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index]

      if (part.startsWith('\\')) {
        const id = parseInt(part.slice(8, -3))
        elem.push(tmp.find((a: Match<T>) => a._id === id))
      } else if (part) {
        elem.push(part)
      }
    }

    return elem
  }

  const pE = (text: string, elem: (string | Match<T>)[] = []) =>
    parseElements(text, parsers, elem)

  for (let index = 0; index < parsers.length; index++) {
    const parser = parsers[index]

    const p = parser({parseElements: pE, getInlineFromPart})
    text = text.replace(p.regex, (...args) => {
      tmp.push(p.replacer(tmp.length, ...args))

      return `\\{{[tiny${tmp.length - 1}]}}`
    })
  }

  return getInlineFromPart(text)
}

export const parse = <T>(text: string, parsers: Parser<T>[]) =>
  parseElements(text, parsers)
