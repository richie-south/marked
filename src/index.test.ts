import {createElement, parse} from './index'
import {blockquoteParser} from './parsers/blockquote-parser'
import {boldItalicParser} from './parsers/bold-italic-parser'
import {breaklinesParser} from './parsers/breaklines-parser'
import {headingParser} from './parsers/heading-parser'
import {linkParser} from './parsers/link-parser'
import {listParser} from './parsers/list-parser'
import {Parser} from './type'

const woowParser: Parser<'woow'> = ({parseElements}) => {
  return {
    regex: /(woow[a-z\d-]+)/gim,
    replacer: (id, match) => {
      const content = match.slice(4)

      return createElement('woow', parseElements(content), id)
    },
  }
}

describe('example woow parser', () => {
  it('woow', () => {
    const string = 'woowHello'
    const result = parse(string, [woowParser])
    expect(result).toEqual([{type: 'woow', _id: 0, value: ['Hello']}])
  })
})

describe('errors', () => {
  it('no text', () => {
    const result = parse(undefined as any, [boldItalicParser])
    expect(result).toEqual([])
  })

  it('no parsers', () => {
    const result = parse('', undefined as any)
    expect(result).toEqual([])
  })

  it('wrong text type', () => {
    expect(() => {
      const result = parse([] as any, [boldItalicParser])
    }).toThrow(TypeError)
  })
})

describe('link parser', () => {
  it('one link', () => {
    const string = '[text](https://example.com)'
    const result = parse(string, [linkParser])
    expect(result).toEqual([
      {type: 'a', _id: 0, value: ['text'], href: 'https://example.com'},
    ])
  })

  it('two links', () => {
    const string = '[text](https://example.com)[text2](https://example2.com)'
    const result = parse(string, [linkParser])
    expect(result).toEqual([
      {type: 'a', _id: 0, value: ['text'], href: 'https://example.com'},
      {type: 'a', _id: 1, value: ['text2'], href: 'https://example2.com'},
    ])
  })

  it('two links with space', () => {
    const string = '[text](https://example.com) [text2](https://example2.com)'
    const result = parse(string, [linkParser])
    expect(result).toEqual([
      {type: 'a', _id: 0, value: ['text'], href: 'https://example.com'},
      ' ',
      {type: 'a', _id: 1, value: ['text2'], href: 'https://example2.com'},
    ])
  })
})

describe('heading parser', () => {
  it('h1', () => {
    const string = '# title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([{type: 'h1', _id: 0, value: ['title']}])
  })

  it('h2', () => {
    const string = '## title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([{type: 'h2', _id: 0, value: ['title']}])
  })

  it('h3', () => {
    const string = '### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([{type: 'h3', _id: 0, value: ['title']}])
  })

  it('h4', () => {
    const string = '#### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([{type: 'h4', _id: 0, value: ['title']}])
  })

  it('h5', () => {
    const string = '##### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([{type: 'h5', _id: 0, value: ['title']}])
  })

  it('h6', () => {
    const string = '###### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([{type: 'h6', _id: 0, value: ['title']}])
  })
})

describe('bold italic parser', () => {
  it('bold', () => {
    const string = '**title**'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([{type: 'strong', _id: 0, value: ['title']}])
  })

  it('italic', () => {
    const string = '*title*'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([{type: 'em', _id: 0, value: ['title']}])
  })

  it('italic bold', () => {
    const string = '***title***'
    const result = parse(string, [boldItalicParser])

    expect(result).toEqual([
      {type: 'em', _id: 0, value: [{type: 'strong', _id: 1, value: ['title']}]},
    ])
  })

  it('multible bold', () => {
    const string = '**title** **title2**'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([
      {type: 'strong', _id: 0, value: ['title']},
      ' ',
      {type: 'strong', _id: 1, value: ['title2']},
    ])
  })

  it('multible italic', () => {
    const string = '*title* *title2*'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([
      {type: 'em', _id: 0, value: ['title']},
      ' ',
      {type: 'em', _id: 1, value: ['title2']},
    ])
  })
})

describe('blockquote parser', () => {
  it('one block', () => {
    const string = '> block'
    const result = parse(string, [blockquoteParser])

    expect(result).toEqual([
      {
        type: 'blockquote',
        _id: 0,
        value: ['block'],
      },
    ])
  })

  it('multible blocks', () => {
    const string = `> block
> block2`
    const result = parse(string, [blockquoteParser])

    expect(result).toEqual([
      {
        type: 'blockquote',
        _id: 0,
        value: ['block'],
      },
      '\n',
      {
        type: 'blockquote',
        _id: 1,
        value: ['block2'],
      },
    ])
  })
})

describe('list parser', () => {
  it('one list item', () => {
    const string = '* item'
    const result = parse(string, [listParser])

    expect(result).toEqual([
      {
        type: 'li',
        _id: 0,
        value: ['item'],
      },
    ])
  })

  it('multible list items', () => {
    const string = `* item
* item 2`
    const result = parse(string, [listParser])

    expect(result).toEqual([
      {
        type: 'li',
        _id: 0,
        value: ['item'],
      },
      '\n',
      {
        type: 'li',
        _id: 1,
        value: ['item 2'],
      },
    ])
  })
})

describe('breaklines parser', () => {
  it('breaklines', () => {
    const string = `<br/>
hej`
    const result = parse(string, [breaklinesParser])

    expect(result).toEqual([
      {
        type: 'br',
        _id: 0,
        value: ['<br/>'],
      },
      {
        type: 'br',
        _id: 1,
        value: ['\n'],
      },
      'hej',
    ])
  })

  it('Multible enters', () => {
    const string = `Multible enters

1. asd.`
    const result = parse(string, [breaklinesParser])

    expect(result).toEqual([
      'Multible enters',
      {
        type: 'br',
        _id: 0,
        value: ['\n'],
      },
      {
        type: 'br',
        _id: 1,
        value: ['\n'],
      },
      '1. asd.',
    ])
  })
})

describe('no match', () => {
  it('no matches', () => {
    const string =
      'Lorem ipsum dolor sit amet consectetur adipiscing elit nascetur etiam, posuere porta accumsan per urna eleifend magnis. Sociis mattis curabitur nec elementum pulvinar dictums aptent montes conubia, tortor nibh morbi lacus praesent cursus maecenas cubilia dictum tristique, augue'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])
    expect(result).toEqual([
      'Lorem ipsum dolor sit amet consectetur adipiscing elit nascetur etiam, posuere porta accumsan per urna eleifend magnis. Sociis mattis curabitur nec elementum pulvinar dictums aptent montes conubia, tortor nibh morbi lacus praesent cursus maecenas cubilia dictum tristique, augue',
    ])
  })
})

describe('combined parsers parser', () => {
  it('bold link', () => {
    const string = '**[text](https://example.com)**'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'strong',
        _id: 1,
        value: [
          {
            type: 'a',
            _id: 0,
            value: ['text'],
            href: 'https://example.com',
          },
        ],
      },
    ])
  })

  it('bold inside link', () => {
    const string = '[**text**](https://example.com)'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'a',
        _id: 0,
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['text'],
          },
        ],
        href: 'https://example.com',
      },
    ])
  })

  it('italic link', () => {
    const string = '*[text](https://example.com)*'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'em',
        _id: 1,
        value: [
          {
            type: 'a',
            _id: 0,
            value: ['text'],
            href: 'https://example.com',
          },
        ],
      },
    ])
  })

  it('bold italic and link next to eachother', () => {
    const string = '**bold** *italic* [text](https://example.com)'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'strong',
        _id: 1,
        value: ['bold'],
      },
      ' ',
      {
        type: 'em',
        _id: 2,
        value: ['italic'],
      },
      ' ',
      {
        type: 'a',
        _id: 0,
        value: ['text'],
        href: 'https://example.com',
      },
    ])
  })

  it('bolded heading', () => {
    const string = '### **bold**'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'h3',
        _id: 0,
        value: [
          {
            type: 'strong',
            _id: 0,
            value: ['bold'],
          },
        ],
      },
    ])
  })

  it('multiline heading first', () => {
    const string = `### **bold**
hej
**next**`

    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'h3',
        _id: 0,
        value: [
          {
            type: 'strong',
            _id: 0,
            value: ['bold'],
          },
        ],
      },
      {
        type: 'br',
        _id: 2,
        value: ['\n'],
      },
      'hej',
      {
        type: 'br',
        _id: 3,
        value: ['\n'],
      },
      {
        type: 'strong',
        _id: 1,
        value: ['next'],
      },
    ])
  })

  it('multiline heading middle', () => {
    const string = `hej
### **bold**
**next**`
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      'hej',
      {
        type: 'br',
        _id: 2,
        value: ['\n'],
      },
      {
        type: 'h3',
        _id: 0,
        value: [
          {
            type: 'strong',
            _id: 0,
            value: ['bold'],
          },
        ],
      },
      {
        type: 'br',
        _id: 3,
        value: ['\n'],
      },
      {
        type: 'strong',
        _id: 1,
        value: ['next'],
      },
    ])
  })

  it('list with breaklines', () => {
    const string = `* asd
* asd
* asd`
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'li',
        _id: 0,
        value: ['asd'],
      },
      {
        type: 'br',
        _id: 3,
        value: ['\n'],
      },
      {
        type: 'li',
        _id: 1,
        value: ['asd'],
      },
      {
        type: 'br',
        _id: 4,
        value: ['\n'],
      },
      {
        type: 'li',
        _id: 2,
        value: ['asd'],
      },
    ])
  })

  it('seperate bold links next to eachother', () => {
    const string = '**[link1](https://link1.se)** **[link2](https://link2.se)**'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'strong',
        _id: 2,
        value: [
          {
            type: 'a',
            _id: 0,
            value: ['link1'],
            href: 'https://link1.se',
          },
        ],
      },
      ' ',
      {
        type: 'strong',
        _id: 3,
        value: [
          {
            type: 'a',
            _id: 1,
            value: ['link2'],
            href: 'https://link2.se',
          },
        ],
      },
    ])
  })

  it('seperate inline bold links next to eachother', () => {
    const string =
      '[**bold link**](https://link.se) [**bold link**](https://link.se)'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      {
        type: 'a',
        _id: 0,
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['bold link'],
          },
        ],
        href: 'https://link.se',
      },
      ' ',
      {
        type: 'a',
        _id: 1,
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['bold link'],
          },
        ],
        href: 'https://link.se',
      },
    ])
  })

  it('no matches inbetween text', () => {
    const string =
      'Lorem ipsum [**bold link**](https://link.se) adipiscing elit nascetur etiam, posuere porta **accumsan** per urna eleifend magnis. *Sociis* mattis curabitur nec elementum pulvinar dictums aptent montes conubia, ***tortor*** nibh morbi lacus praesent cursus maecenas cubilia [link](https://example.se)'
    const result = parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    expect(result).toEqual([
      'Lorem ipsum ',
      {
        type: 'a',
        _id: 0,
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['bold link'],
          },
        ],
        href: 'https://link.se',
      },
      ' adipiscing elit nascetur etiam, posuere porta ',
      {
        type: 'strong',
        _id: 2,
        value: ['accumsan'],
      },
      ' per urna eleifend magnis. ',
      {
        type: 'em',
        _id: 3,
        value: ['Sociis'],
      },
      ' mattis curabitur nec elementum pulvinar dictums aptent montes conubia, ',
      {
        type: 'em',
        _id: 4,
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['tortor'],
          },
        ],
      },
      ' nibh morbi lacus praesent cursus maecenas cubilia ',
      {
        type: 'a',
        _id: 1,
        value: ['link'],
        href: 'https://example.se',
      },
    ])
  })
})

describe('performance', () => {
  it('Should not take to long time', () => {
    const string =
      '[**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) är att ***bold italic*** ![image](https://image.se) [**bold link**](https://link.se) **bold** meningen med livet [link](https://example.com) '

    const beforeDate = new Date()
    parse(string, [
      blockquoteParser,
      listParser,
      headingParser,
      linkParser,
      boldItalicParser,
      breaklinesParser,
    ])

    const afterDate = new Date()

    const time = afterDate.getTime() - beforeDate.getTime()

    expect(time).toBeLessThanOrEqual(8)
  })
})
