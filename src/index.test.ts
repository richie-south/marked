import {parse} from './index'

describe('markdown parser', () => {
  it('parse link', () => {
    const string = '[text](https://example.com)'
    const result = parse(string)
    expect(result).toEqual([
      {type: 'a', _id: 0, value: ['text'], href: 'https://example.com'},
    ])
  })

  it('parse bold link', () => {
    const string = '**[text](https://example.com)**'
    const result = parse(string)

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

  it('parse bold', () => {
    const string = '**bold**'
    const result = parse(string)

    expect(result).toEqual([
      {
        type: 'strong',
        _id: 0,
        value: ['bold'],
      },
    ])
  })

  it('parse bold inside link', () => {
    const string = '[**text**](https://example.com)'
    const result = parse(string)

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

  it('parse italic', () => {
    const string = '*italic*'
    const result = parse(string)

    expect(result).toEqual([
      {
        type: 'em',
        _id: 0,
        value: ['italic'],
      },
    ])
  })

  it('parse italic link', () => {
    const string = '*[text](https://example.com)*'
    const result = parse(string)

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

  it('parse bold italic and link next to eachother', () => {
    const string = '**bold** *italic* [text](https://example.com)'
    const result = parse(string)

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

  it('parse heading', () => {
    const string = '### title'
    const result = parse(string)

    expect(result).toEqual([
      {
        type: 'h3',
        _id: 0,
        value: ['title'],
      },
    ])
  })

  it('parse bolded heading', () => {
    const string = '### **bold**'
    const result = parse(string)

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

  it('parse multiline heading first', () => {
    const string = `### **bold**
hej
**next**`

    const result = parse(string)

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

  it('parse multiline heading middle', () => {
    const string = `hej
### **bold**
**next**`
    const result = parse(string)

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

  it('parse breaklines', () => {
    const string = `<br/>
hej`
    const result = parse(string)

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

  it('parse list', () => {
    const string = `* asd
* asd
* asd`
    const result = parse(string)

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

  it('parse seperate bold links next to eachother', () => {
    const string = '**[link1](https://link1.se)** **[link2](https://link2.se)**'
    const result = parse(string)

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

  it('parse seperate inline bold links next to eachother', () => {
    const string =
      '[**bold link**](https://link.se) [**bold link**](https://link.se)'
    const result = parse(string)

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

  it('parse links next to eachother', () => {
    const string = '[bold link](https://link.se) [bold link](https://link.se)'
    const result = parse(string)

    expect(result).toEqual([
      {
        type: 'a',
        _id: 0,
        value: ['bold link'],
        href: 'https://link.se',
      },
      ' ',
      {
        type: 'a',
        _id: 1,
        value: ['bold link'],
        href: 'https://link.se',
      },
    ])
  })
})
