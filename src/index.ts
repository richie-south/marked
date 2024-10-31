import {Match, Parser} from './type'

/**
 * Creates a Match object
 * @param {string} type type of element, example: h1
 * @param {(string | Match)[]} value nested matches | values
 * @param {number} _id none uniq id
 * @param {Record<string, unknown>} attributes any custom attributes will be placed within attributes object
 * @returns Match
 */
export const createElement = <T>(
  type: Match['type'],
  value: Match['value'],
  _id: number,
  attributes: Record<string, unknown> = {},
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
   * split by markes and push parsed elements in order
   */
  const getInline = (value: string) => {
    const elem: (string | Match<T>)[] = []

    const parts = value.split(/(\\{{\[v\d+\]}})/g)
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index]

      if (part.startsWith('\\{{[v')) {
        const id = parseInt(part.slice(5, -3)) // slices \{{[v and ]}}

        const item = tmp.find((a: Match<T>) => a._id === id)
        if (item) elem.push(item)
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

    const p = parser({parseElements: pE, getInline})
    text = text.replace(p.regex, (...args) => {
      tmp.push(p.replacer(tmp.length, ...args))

      return `\\{{[v${tmp.length - 1}]}}`
    })
  }

  return getInline(text)
}

/**
 * Parses markdown
 * @param {string} text input text
 * @param {Parser<T>} parsers list of parsers
 * @returns list of objects representing markdown structure
 *
 * @example
 * ```
 * const result = parse('**bold text**', [boldItalicParser])
 * console.log(result) // [{type: 'strong', _id: 0, value: ['bold text']}]
 * ```
 */
export const parse = <T>(
  text: string,
  parsers: Parser<T>[],
): (string | Match<T>)[] => parseElements(text, parsers)
