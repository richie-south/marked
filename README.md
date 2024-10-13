# tiny-marked

A tiny markdown subset parser

**Can handle:**

> - Blockquote
> - Bold
> - Breaklines
> - Email
> - Heading
> - Images
> - Italic
> - Links
> - Unordered lists

**Install**

```
$ npm i tiny-marked
```

**Usage example**

```typescript
import {parse} from 'tiny-marked'
import {blockquoteParser} from 'tiny-marked/lib/parsers/blockquote-parser'
import {boldItalicParser} from 'tiny-marked/lib/parsers/bold-italic-parser'
import {breaklinesParser} from 'tiny-marked/lib/parsers/breaklines-parser'
import {headingParser} from 'tiny-marked/lib/parsers/heading-parser'
import {linkParser} from 'tiny-marked/lib/parsers/link-parser'
import {listParser} from 'tiny-marked/lib/parsers/list-parser'

const result = parse('**[text](https://example.com)**', [
  blockquoteParser,
  listParser,
  headingParser,
  linkParser,
  boldItalicParser,
  breaklinesParser,
])

/* result
  [
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
  ]
*/

const result = parse('**bold** *italic* [text](https://example.com)', [
  blockquoteParser,
  listParser,
  headingParser,
  linkParser,
  boldItalicParser,
  breaklinesParser,
])

/* result
  [
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
  ]
*/
```

## Built in parsers

**blockquoteParser**

Parses blocks quotes.

import:

```typescript
import {blockquoteParser} from 'tiny-marked/lib/parsers/blockquote-parser'
```

Example:

```
> Hello
```

**listParser**

Parses unordered lists

import:

```typescript
import {listParser} from 'tiny-marked/lib/parsers/list-parser'
```

Example:

```
  * Hello
  * hello
```

**headingParser**

Parses headings 1-6

import:

```typescript
import {headingParser} from 'tiny-marked/lib/parsers/heading-parser'
```

Example:

```
# Hello
###### Hello
```

**linkParser**

Parses links, images, emails

import:

```typescript
import {linkParser} from 'tiny-marked/lib/parsers/link-parser'
```

Example:

```
[link](https//example.com)
![image alt text](https//image-link.com)
```

**boldItalicParser**

Parses bold and italic

import:

```typescript
import {boldItalicParser} from 'tiny-marked/lib/parsers/bold-italic-parser'
```

Example:

```
**This text is bold**
*Italic text*
```

**breaklinesParser**

Parses break lines

import:

```typescript
import {breaklinesParser} from 'tiny-marked/lib/parsers/breaklines-parser'
```

Example:

```
\n
\r
<br />
```

### Build string or components

Some alternatives to building component or string from parse result.

**First**

Using recursive map

```typescript
function build(data) {
  if (typeof data === 'string') {
    return data
  }

  if (data.type === 'strong') {
    const components = data.value.map(build).join('')
    return `<strong>${components}</strong>`
  }

  if (data.type === 'em') {
    const components = data.value.map(build).join('')
    return `<em>${components}</em>`
  }

  if (data.type === 'a') {
    const components = data.value.map(build).join('')
    return `<a href="${arguments.href}">${components}</a>`
  }

  return data.match
}

const data = [
  {
    type: 'strong',
    value: [
      {
        type: 'a',
        value: ['bold link'],
        href: 'https://example.com',
      },
    ],
  },
  ' ',
  {
    type: 'em',
    value: ['italic'],
  },
]

const components = data.map(build)

console.log(components.join(''))
/* result
  <strong><a href="https://example.com">bold link</a></strong> <em>italic</em>
*/
```

**Second**

Using an iterator to flatten the list and give action on when to open or close elements

```typescript
function* traverse(list: Array<Match | string>) {
  let index = 0
  while (list[index] !== undefined) {
    const item = list[index]
    index += 1

    if (typeof item === 'string') {
      yield {type: 'string', value: item}

      continue
    }

    yield {type: item.type, action: 'open'}

    const iterator = traverse(item.value)
    let message = iterator.next()
    while (!message.done) {
      yield message.value

      message = iterator.next()
    }

    yield {type: item.type, action: 'close'}
  }

  return
}

function build(list) {
  const iterator = traverse(list)
  let str = ''

  let message = iterator.next()
  while (!message.done) {
    const item = message.value

    switch (item.type) {
      case 'string':
        str += item.value
        break
      case 'strong':
        if (item.action === 'open') {
          str += `<strong>`
        } else {
          str += '</strong>'
        }

        break
      case 'a':
        if (item.action === 'open') {
          str += `<a href="${item.href}">`
        } else {
          str += '</a>'
        }

        break
      case 'em':
        if (item.action === 'open') {
          str += `<em>`
        } else {
          str += '</em>'
        }

        break
    }

    message = iterator.next()
  }

  return str
}

const data = [
  {
    type: 'strong',
    value: [
      {
        type: 'a',
        value: ['bold link'],
        href: 'https://example.com',
      },
    ],
  },
  ' ',
  {
    type: 'em',
    value: ['italic'],
  },
]

console.log(build(data))

/** result
  <strong><a href="https://example.com">bold link</a></strong> <em>italic</em>
*/
```

## Create your own parser

Create a function that implements the `Parser` interface.

**Example**

"woow" parser

```typescript
import {createElement} from 'tiny-marked'

const woowParser: Parser = ({parseElements, tmp}) => {
  return {
    regex: /(woow[a-z\d-]+)/gim, // matches on "woow" then everything until a space or enter
    replacer: (match) => {
      const content = match.slice(4) // everything after "woow" can be parsed again by another parser

      tmp.push(createElement('woow', parseElements(content), tmp.length)) // push our element to the tmp array
      return `\\${tmp.length - 1}` // replaces woow with an index to rebuild correct in correct order later
    },
  }
}
```
