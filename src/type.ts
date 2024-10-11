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

type MatchBlockquote = {
  type: typeof blockTypeBlockquote
  value: Array<string | Match>
}

type MatchBlockTypeH1 = {
  type: typeof blockTypeH1
  value: Array<string | Match>
}

type MatchBlockTypeH2 = {
  type: typeof blockTypeH2
  value: Array<string | Match>
}

type MatchBlockTypeH3 = {
  type: typeof blockTypeH3
  value: Array<string | Match>
}

type MatchBlockTypeH4 = {
  type: typeof blockTypeH4
  value: Array<string | Match>
}

type MatchBlockTypeH5 = {
  type: typeof blockTypeH5
  value: Array<string | Match>
}

type MatchBlockTypeH6 = {
  type: typeof blockTypeH6
  value: Array<string | Match>
}

type MatchBlockTypeImg = {
  type: typeof blockTypeImg
  value: Array<string | Match>
  attributes: {
    href: string
  }
}

type MatchBlockTypeA = {
  type: typeof blockTypeA
  value: Array<string | Match>
  attributes: {
    src: string
    alt: string
  }
}

type MatchBlockTypeStrong = {
  type: typeof blockTypeStrong
  value: Array<string | Match>
}

type MatchBlockTypeEm = {
  type: typeof blockTypeEm
  value: Array<string | Match>
}

type MatchBlockTypeBr = {
  type: typeof blockTypeBr
  value: Array<string | Match>
}

type MatchBlockTypeLi = {
  type: typeof blockTypeLi
  value: Array<string | Match>
}

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
