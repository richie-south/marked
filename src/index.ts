import {Match} from './type'

/**
 * Creates an object representing an HTML element with optional attributes and children.
 */
const createElement = (
  type: Match['type'],
  value: Match['value'],
  attributes = {},
): Match =>
  ({
    type,
    value,
    ...attributes,
  } as Match)

const parseElements = (text: string, elem: Array<Match | string> = []) => {
  const elements: Array<Match | string> = []
  const tmp: Array<Match | string> = elem

  /**
   * split by markes and push back text pr parsed elements
   */
  const orderElements = (value: string) => {
    value.split(/(\\\d+)/g).forEach((part) => {
      if (part.startsWith('\\')) {
        elements.push(tmp[parseInt(part.slice(1))])
      } else if (part) {
        elements.push(part)
      }
    })
  }

  const getInlineFromPart = (value: string) => {
    const elem: Array<Match | string> = []
    value.split(/(\\\d+)/g).forEach((part) => {
      if (part.startsWith('\\')) {
        elem.push(tmp[parseInt(part.slice(1))])
      } else if (part) {
        elem.push(part)
      }
    })

    return elem
  }

  // blockquote
  text = text.replace(/^> (.+)$/gm, (match, content: string) => {
    tmp.push(createElement('blockquote', parseElements(content)))
    return `\\${tmp.length - 1}`
  })

  // lists
  text = text.replace(/^[-*+] (.+)$/gm, (match, content: string) => {
    tmp.push(createElement('li', parseElements(content)))
    return `\\${tmp.length - 1}`
  })

  // heading
  text = text.replace(
    /^(#{1,6}) (.+)$/gm,
    (match, hashes: string, content: string) => {
      const type = `h${hashes.length}` as 'h1'

      tmp.push(createElement(type, parseElements(content)))
      return `\\${tmp.length - 1}`
    },
  )

  // Handle links, email and images
  text = text.replace(
    /!?\[([^\]]+)]\((.*?)\)/g,
    (match, content: string, url: string) => {
      const elem = getInlineFromPart(content)

      if (match.startsWith('!')) {
        tmp.push(createElement('img', [''], {src: url, alt: content}))
      } else {
        tmp.push(createElement('a', parseElements(content, elem), {href: url}))
      }

      return `\\${tmp.length - 1}`
    },
  )

  // Handle bold and italic
  text = text.replace(
    /([*_]{1,3})(.+?)\1/g,
    (match, marker: string, content: string) => {
      const type = marker.length === 1 ? 'em' : 'strong'
      const elem = getInlineFromPart(content)

      tmp.push(createElement(type, parseElements(content, elem)))
      return `\\${tmp.length - 1}`
    },
  )

  // breaklines
  text = text.replace(/(\r\n|\n|\r|<br\/>)/gm, (match, content) => {
    tmp.push(createElement('br', [content]))
    return `\\${tmp.length - 1}`
  })

  orderElements(text)
  return elements
}

export const parse = (text: string) => parseElements(text)
