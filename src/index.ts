import {Match} from './type'

/**
 * Creates an object representing an HTML element with optional attributes and children.
 */
const createElement = (
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

const parseElements = (text: string, elem: Array<Match | string> = []) => {
  let elements: Array<Match | string> = []
  const tmp: Array<Match | string> = elem

  /**
   * split by markes and push back text pr parsed elements
   */
  const getInlineFromPart = (value: string) => {
    const elem: Array<Match | string> = []
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

  // blockquote
  text = text.replace(/^> (.+)$/gm, (_, content: string) => {
    tmp.push(createElement('blockquote', parseElements(content), tmp.length))
    return `\\${tmp.length - 1}`
  })

  // lists
  text = text.replace(/^[-*+] (.+)$/gm, (_, content: string) => {
    tmp.push(createElement('li', parseElements(content), tmp.length))
    return `\\${tmp.length - 1}`
  })

  // heading
  text = text.replace(
    /^(#{1,6}) (.+)$/gm,
    (_, hashes: string, content: string) => {
      const type = `h${hashes.length}` as 'h1'

      tmp.push(createElement(type, parseElements(content), tmp.length))
      return `\\${tmp.length - 1}`
    },
  )

  // Handle links, email and images
  text = text.replace(
    /!?\[([^\]]+)]\((.*?)\)/g,
    (match, content: string, url: string) => {
      const elem = getInlineFromPart(content)

      if (match.startsWith('!')) {
        tmp.push(
          createElement('img', [''], tmp.length, {src: url, alt: content}),
        )
      } else {
        tmp.push(
          createElement('a', parseElements(content, elem), tmp.length, {
            href: url,
          }),
        )
      }

      return `\\${tmp.length - 1}`
    },
  )

  // Handle bold and italic
  text = text.replace(
    /([*_]{1,3})(.+?)\1/g,
    (_, marker: string, content: string) => {
      const type = marker.length === 1 ? 'em' : 'strong'
      const elem = getInlineFromPart(content)

      tmp.push(createElement(type, parseElements(content, elem), tmp.length))
      return `\\${tmp.length - 1}`
    },
  )

  // breaklines
  text = text.replace(/(\r\n|\n|\r|<br\/>)/gm, (_, content) => {
    tmp.push(createElement('br', [content], tmp.length))
    return `\\${tmp.length - 1}`
  })

  return elements.concat(getInlineFromPart(text))
}

export const parse = (text: string) => parseElements(text)
