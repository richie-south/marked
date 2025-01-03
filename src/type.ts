export type Match<T = unknown> = {
  type: T
  value: (string | Match<T>)[]
  _id: number
  attributes: Record<string, unknown>
}

interface ParserProps {
  parseElements: (
    content: string,
    elem?: (Match | string)[],
  ) => (string | Match)[]
  getInline: (content: string) => (string | Match)[]
}

interface ParserReturn<T> {
  ignore?: string[]
  regex: RegExp | string //  | ((value: string) => RegExp | string)
  replacer: (id: number, substring: string, ...args: any[]) => Match<T>
}

export interface Parser<T> {
  (props: ParserProps): ParserReturn<T>
}
