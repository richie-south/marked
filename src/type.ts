export type Match<T = unknown> = {
  type: T
  value: (string | Match<T>)[]
  _id: number
}

interface ParserProps {
  parseElements: (
    content: string,
    elem?: (Match | string)[],
  ) => (string | Match)[]
  getInlineFromPart: (content: string) => (string | Match)[]
}

interface ParserReturn<T> {
  regex: RegExp | string
  replacer: (id: number, substring: string, ...args: any[]) => Match<T>
}

export interface Parser<T> {
  (props: ParserProps): ParserReturn<T>
}
