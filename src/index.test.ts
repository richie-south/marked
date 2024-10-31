import {createElement, parse} from './index'
import {blockquoteParser} from './parsers/blockquote-parser'
import {boldItalicParser} from './parsers/bold-italic-parser'
import {breaklinesParser} from './parsers/breaklines-parser'
import {headingParser} from './parsers/heading-parser'
import {linkParser} from './parsers/link-parser'
import {listParser} from './parsers/list-parser'
import {strikeParser} from './parsers/strike-parser'
import {footnoteParser} from './parsers/footnote-parser'
import {blockParser} from './parsers/block-parser'

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
    expect(result).toEqual([
      {type: 'woow', _id: 0, value: ['Hello'], attributes: {}},
    ])
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

describe('strike parser', () => {
  it('strikethrough', () => {
    const string = '~~Striked~~'
    const result = parse(string, [strikeParser])

    expect(result).toEqual([
      {
        type: 's',
        _id: 0,
        value: ['Striked'],
        attributes: {},
      },
    ])
  })

  it('multible strikethrough', () => {
    const string = '~~Striked~~~~again~~'
    const result = parse(string, [strikeParser])

    expect(result).toEqual([
      {
        type: 's',
        _id: 0,
        value: ['Striked'],
        attributes: {},
      },
      {
        type: 's',
        _id: 1,
        value: ['again'],
        attributes: {},
      },
    ])
  })
})

describe('footnote parser', () => {
  it('footnote', () => {
    const string = `[^note]`
    const result = parse(string, [footnoteParser])

    expect(result).toEqual([
      {
        type: 'footnote',
        _id: 0,
        value: ['note'],
        attributes: {},
      },
    ])
  })

  it('footnote with end', () => {
    const string = `[^note]
text
[^note]: result`
    const result = parse(string, [footnoteParser])

    expect(result).toEqual([
      {
        type: 'footnote',
        _id: 0,
        value: ['note'],
        attributes: {},
      },
      '\ntext\n',
      {
        type: 'footnote',
        _id: 1,
        value: ['note'],
        attributes: {end: true},
      },
      ' result',
    ])
  })
})

describe('block parser', () => {
  it('single tick', () => {
    const string = '`block`'
    const result = parse(string, [blockParser])

    expect(result).toEqual([
      {
        type: 'code',
        _id: 0,
        value: ['block'],
        attributes: {},
      },
    ])
  })

  it('fenced', () => {
    const string = '```block```'
    const result = parse(string, [blockParser])

    expect(result).toEqual([
      {
        type: 'code',
        _id: 0,
        value: ['block'],
        attributes: {},
      },
    ])
  })

  it('fenced multiline', () => {
    const string = `\`\`\`
block
\`\`\``
    const result = parse(string, [blockParser])

    expect(result).toEqual([
      {
        type: 'code',
        _id: 0,
        value: ['\nblock\n'],
        attributes: {},
      },
    ])
  })
})

describe('link parser', () => {
  it('one link', () => {
    const string = '[text](https://example.com)'
    const result = parse(string, [linkParser])
    expect(result).toEqual([
      {
        type: 'a',
        _id: 0,
        value: ['text'],
        attributes: {href: 'https://example.com'},
      },
      ,
    ])
  })

  it('two links', () => {
    const string = '[text](https://example.com)[text2](https://example2.com)'
    const result = parse(string, [linkParser])
    expect(result).toEqual([
      {
        type: 'a',
        _id: 0,
        value: ['text'],
        attributes: {href: 'https://example.com'},
      },

      {
        type: 'a',
        _id: 1,
        value: ['text2'],
        attributes: {href: 'https://example2.com'},
      },
    ])
  })

  it('two links with space', () => {
    const string = '[text](https://example.com) [text2](https://example2.com)'
    const result = parse(string, [linkParser])
    expect(result).toEqual([
      {
        type: 'a',
        _id: 0,
        value: ['text'],
        attributes: {href: 'https://example.com'},
      },

      ' ',
      {
        type: 'a',
        _id: 1,
        value: ['text2'],
        attributes: {href: 'https://example2.com'},
      },
    ])
  })
})

describe('heading parser', () => {
  it('h1', () => {
    const string = '# title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([
      {type: 'h1', _id: 0, value: ['title'], attributes: {}},
    ])
  })

  it('h2', () => {
    const string = '## title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([
      {type: 'h2', _id: 0, value: ['title'], attributes: {}},
    ])
  })

  it('h3', () => {
    const string = '### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([
      {type: 'h3', _id: 0, value: ['title'], attributes: {}},
    ])
  })

  it('h4', () => {
    const string = '#### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([
      {type: 'h4', _id: 0, value: ['title'], attributes: {}},
    ])
  })

  it('h5', () => {
    const string = '##### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([
      {type: 'h5', _id: 0, value: ['title'], attributes: {}},
    ])
  })

  it('h6', () => {
    const string = '###### title'
    const result = parse(string, [headingParser])
    expect(result).toEqual([
      {type: 'h6', _id: 0, value: ['title'], attributes: {}},
    ])
  })
})

describe('bold italic parser', () => {
  it('bold', () => {
    const string = '**title**'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([
      {type: 'strong', _id: 0, value: ['title'], attributes: {}},
    ])
  })

  it('italic', () => {
    const string = '*title*'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([
      {type: 'em', _id: 0, value: ['title'], attributes: {}},
    ])
  })

  it('italic bold', () => {
    const string = '***title***'
    const result = parse(string, [boldItalicParser])

    expect(result).toEqual([
      {
        type: 'em',
        _id: 0,
        attributes: {},
        value: [{type: 'strong', _id: 1, value: ['title'], attributes: {}}],
      },
    ])
  })

  it('multible bold', () => {
    const string = '**title** **title2**'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([
      {type: 'strong', _id: 0, value: ['title'], attributes: {}},
      ' ',
      {type: 'strong', _id: 1, value: ['title2'], attributes: {}},
    ])
  })

  it('multible italic', () => {
    const string = '*title* *title2*'
    const result = parse(string, [boldItalicParser])
    expect(result).toEqual([
      {type: 'em', _id: 0, value: ['title'], attributes: {}},
      ' ',
      {type: 'em', _id: 1, value: ['title2'], attributes: {}},
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
        attributes: {},
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
        attributes: {},
      },
      '\n',
      {
        type: 'blockquote',
        _id: 1,
        value: ['block2'],
        attributes: {},
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
        attributes: {},
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
        attributes: {},
      },
      '\n',
      {
        type: 'li',
        _id: 1,
        value: ['item 2'],
        attributes: {},
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
        attributes: {},
      },
      {
        type: 'br',
        _id: 1,
        value: ['\n'],
        attributes: {},
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
        attributes: {},
      },
      {
        type: 'br',
        _id: 1,
        value: ['\n'],
        attributes: {},
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
        attributes: {},
        value: [
          {
            type: 'a',
            _id: 0,
            value: ['text'],
            attributes: {
              href: 'https://example.com',
            },
          },
        ],
      },
    ])
  })

  it('text and link withing the same bold wrap', () => {
    const string = '**Lorem ipsum [text](https://example.com)**'
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
        attributes: {},
        value: [
          'Lorem ipsum ',
          {
            type: 'a',
            _id: 0,
            value: ['text'],
            attributes: {
              href: 'https://example.com',
            },
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
        attributes: {href: 'https://example.com'},
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['text'],
            attributes: {},
          },
        ],
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
        attributes: {},
        value: [
          {
            type: 'a',
            _id: 0,
            value: ['text'],
            attributes: {
              href: 'https://example.com',
            },
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
        attributes: {},
      },
      ' ',
      {
        type: 'em',
        _id: 2,
        value: ['italic'],
        attributes: {},
      },
      ' ',
      {
        type: 'a',
        _id: 0,
        value: ['text'],
        attributes: {
          href: 'https://example.com',
        },
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
        attributes: {},
        value: [
          {
            type: 'strong',
            _id: 0,
            value: ['bold'],
            attributes: {},
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
        attributes: {},
        value: [
          {
            type: 'strong',
            _id: 0,
            attributes: {},
            value: ['bold'],
          },
        ],
      },
      {
        type: 'br',
        _id: 2,
        value: ['\n'],
        attributes: {},
      },
      'hej',
      {
        type: 'br',
        _id: 3,
        value: ['\n'],
        attributes: {},
      },
      {
        type: 'strong',
        _id: 1,
        value: ['next'],
        attributes: {},
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
        attributes: {},
      },
      {
        type: 'h3',
        _id: 0,
        attributes: {},
        value: [
          {
            type: 'strong',
            _id: 0,
            value: ['bold'],
            attributes: {},
          },
        ],
      },
      {
        type: 'br',
        _id: 3,
        value: ['\n'],
        attributes: {},
      },
      {
        type: 'strong',
        _id: 1,
        value: ['next'],
        attributes: {},
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
        attributes: {},
      },
      {
        type: 'br',
        _id: 3,
        value: ['\n'],
        attributes: {},
      },
      {
        type: 'li',
        _id: 1,
        value: ['asd'],
        attributes: {},
      },
      {
        type: 'br',
        _id: 4,
        value: ['\n'],
        attributes: {},
      },
      {
        type: 'li',
        _id: 2,
        value: ['asd'],
        attributes: {},
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
        attributes: {},
        value: [
          {
            type: 'a',
            _id: 0,
            value: ['link1'],
            attributes: {
              href: 'https://link1.se',
            },
          },
        ],
      },
      ' ',
      {
        type: 'strong',
        _id: 3,
        attributes: {},
        value: [
          {
            type: 'a',
            _id: 1,
            value: ['link2'],
            attributes: {
              href: 'https://link2.se',
            },
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
        attributes: {href: 'https://link.se'},
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['bold link'],
            attributes: {},
          },
        ],
      },
      ' ',
      {
        type: 'a',
        _id: 1,
        attributes: {href: 'https://link.se'},
        value: [
          {
            type: 'strong',
            _id: 1,
            value: ['bold link'],
            attributes: {},
          },
        ],
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
        attributes: {href: 'https://link.se'},
        value: [
          {
            type: 'strong',
            _id: 1,
            attributes: {},
            value: ['bold link'],
          },
        ],
      },
      ' adipiscing elit nascetur etiam, posuere porta ',
      {
        type: 'strong',
        _id: 2,
        attributes: {},
        value: ['accumsan'],
      },
      ' per urna eleifend magnis. ',
      {
        type: 'em',
        _id: 3,
        attributes: {},
        value: ['Sociis'],
      },
      ' mattis curabitur nec elementum pulvinar dictums aptent montes conubia, ',
      {
        type: 'em',
        _id: 4,
        attributes: {},
        value: [
          {
            type: 'strong',
            _id: 1,
            attributes: {},
            value: ['tortor'],
          },
        ],
      },
      ' nibh morbi lacus praesent cursus maecenas cubilia ',
      {
        type: 'a',
        _id: 1,
        attributes: {href: 'https://example.se'},
        value: ['link'],
      },
    ])
  })

  it('_id should keep on increasing', () => {
    const string =
      '*italic* **bold** **bold** **bold** **bold** [link](https://link.se) **bold** **bold** **bold** **bold** **bold** **bold** '
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
        attributes: {},
        value: ['italic'],
      },
      ' ',
      {
        type: 'strong',
        _id: 2,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 3,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 4,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 5,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'a',
        _id: 0,
        attributes: {href: 'https://link.se'},
        value: ['link'],
      },
      ' ',
      {
        type: 'strong',
        _id: 6,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 7,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 8,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 9,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 10,
        attributes: {},
        value: ['bold'],
      },
      ' ',
      {
        type: 'strong',
        _id: 11,
        attributes: {},
        value: ['bold'],
      },
      ' ',
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

  it('Should not casue stackoverflow for recursion', () => {
    const string =
      '🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱 🥱'

    const emojiParser: Parser<'EmojiParser'> = () => {
      return {
        regex: /🥱/g,
        replacer: (id) => {
          return createElement('EmojiParser', [], id)
        },
      }
    }

    const beforeDate = new Date()
    parse(string, [emojiParser])

    const afterDate = new Date()
    const time = afterDate.getTime() - beforeDate.getTime()

    expect(time).toBeLessThanOrEqual(200)
  })
})
