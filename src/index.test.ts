import {parse} from './index'

describe('markdown parser', () => {
  it('parse link', () => {
    const string = '[text](https://example.com)'
    const result = parse(string)
    expect(result).toEqual([
      {type: 'a', value: ['text'], href: 'https://example.com'},
    ])
  })

  it('parse bold link', () => {
    const string = '**[text](https://example.com)**'
    const result = parse(string)

    expect(result).toEqual([
      {
        type: 'strong',
        value: [
          {
            type: 'a',
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
        value: [
          {
            type: 'strong',
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
        value: [
          {
            type: 'a',
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
        value: ['bold'],
      },
      ' ',
      {
        type: 'em',
        value: ['italic'],
      },
      ' ',
      {
        type: 'a',
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
        value: [
          {
            type: 'strong',
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
        value: [
          {
            type: 'strong',
            value: ['bold'],
          },
        ],
      },
      {
        type: 'br',
        value: ['\n'],
      },
      'hej',
      {
        type: 'br',
        value: ['\n'],
      },
      {
        type: 'strong',
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
        value: ['\n'],
      },
      {
        type: 'h3',
        value: [
          {
            type: 'strong',
            value: ['bold'],
          },
        ],
      },
      {
        type: 'br',
        value: ['\n'],
      },
      {
        type: 'strong',
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
        value: ['<br/>'],
      },
      {
        type: 'br',
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
        value: ['asd'],
      },
      {
        type: 'br',
        value: ['\n'],
      },
      {
        type: 'li',
        value: ['asd'],
      },
      {
        type: 'br',
        value: ['\n'],
      },
      {
        type: 'li',
        value: ['asd'],
      },
    ])
  })
})
