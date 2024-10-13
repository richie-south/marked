const blockTypeBlockquote = 'blockquote'
const blockTypeH1 = 'h1'
const blockTypeH2 = 'h2'
const blockTypeH3 = 'h3'
const blockTypeH4 = 'h4'
const blockTypeH5 = 'h5'
const blockTypeH6 = 'h6'
const blockTypeImg = 'img'
const blockTypeA = 'a'
const blockTypeStrong = 'strong'
const blockTypeEm = 'em'
const blockTypeBr = 'br'
const blockTypeLi = 'li'

type _Match = {
  value: Array<string | Match>
  _id: number
}

type MatchGeneric = {
  type: string
  value: Array<string | Match>
  _id: number
}

type MatchBlockquote = {
  type: typeof blockTypeBlockquote
} & _Match

type MatchBlockTypeH1 = {
  type: typeof blockTypeH1
} & _Match

type MatchBlockTypeH2 = {
  type: typeof blockTypeH2
} & _Match

type MatchBlockTypeH3 = {
  type: typeof blockTypeH3
} & _Match

type MatchBlockTypeH4 = {
  type: typeof blockTypeH4
} & _Match

type MatchBlockTypeH5 = {
  type: typeof blockTypeH5
} & _Match

type MatchBlockTypeH6 = {
  type: typeof blockTypeH6
} & _Match

type MatchBlockTypeImg = {
  type: typeof blockTypeImg
  attributes: {
    href: string
  }
} & _Match

type MatchBlockTypeA = {
  type: typeof blockTypeA
  attributes: {
    src: string
    alt: string
  }
} & _Match

type MatchBlockTypeStrong = {
  type: typeof blockTypeStrong
} & _Match

type MatchBlockTypeEm = {
  type: typeof blockTypeEm
} & _Match

type MatchBlockTypeBr = {
  type: typeof blockTypeBr
} & _Match

type MatchBlockTypeLi = {
  type: typeof blockTypeLi
} & _Match

export type Match =
  | MatchBlockquote
  | MatchBlockTypeH1
  | MatchBlockTypeH2
  | MatchBlockTypeH3
  | MatchBlockTypeH4
  | MatchBlockTypeH5
  | MatchBlockTypeH6
  | MatchBlockTypeImg
  | MatchBlockTypeA
  | MatchBlockTypeStrong
  | MatchBlockTypeEm
  | MatchBlockTypeBr
  | MatchBlockTypeLi
  | MatchGeneric

interface ParserProps {
  parseElements: (
    content: string,
    elem?: (Match | string)[],
  ) => (string | Match)[]
  getInlineFromPart: (content: string) => (string | Match)[]
  tmp: (Match | string)[]
}

interface ParserReturn {
  regex: RegExp | string
  replacer: (substring: string, ...args: any[]) => string
}

export interface Parser {
  (props: ParserProps): ParserReturn
}
