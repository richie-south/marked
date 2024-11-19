# tiny-marked

A tiny markdown subset parser that is ≈ 1kb in size.
Outputs a tree structure instead of completed string. This way you can handle that logic your self and render it in any way.
Run it on frontend with react or other types of components, use Nodejs to prerender / analyze content.

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
> - footnote
> - strikethrough
> - block

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
import {footnoteParser} from 'tiny-marked/lib/parsers/footnote-parser'
import {strikeParser} from 'tiny-marked/lib/parsers/strike-parser'
import {blockParser} from 'tiny-marked/lib/parsers/block-parser'

const result = parse('**[text](https://example.com)**', [
  blockquoteParser,
  listParser,
  headingParser,
  linkParser,
  boldItalicParser,
  breaklinesParser,
  footnoteParser,
  strikeParser,
  blockParser,
])

/* result
  [
    {
      type: 'strong',
      value: [
        {
          type: 'a',
          value: ['text'],
          attributes: {
            href: 'https://example.com',
          }
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
  footnoteParser,
  strikeParser,
  blockParser,
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
      attributes: {
        href: 'https://example.com',
      }
    },
  ]
*/
```

## Built in parsers

### blockquoteParser

Parses blocks quotes.

import:

```typescript
import {blockquoteParser} from 'tiny-marked/lib/parsers/blockquote-parser'
```

Example:

```
> Hello
```

Result:

```typescript
// > block
{
  type: 'blockquote',
  value: ['block'],
  attributes: {},
}
```

### listParser

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

Result:

```typescript
// * item
{
  type: 'li',
  value: ['item'],
  attributes: {},
}
```

### headingParser

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

Result:

```typescript
// # title
{
  type: 'h1',
  value: ['title'],
  attributes: {},
}
```

### linkParser

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

Result:

```typescript
// '[text](https://example.com)'
{
  type: 'a',
  value: ['text'],
  attributes: {href: 'https://example.com'},
}
```

### boldItalicParser

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

Result:

```typescript
// **title**
{
  type: 'strong',
  value: ['title'],
  attributes: {},
}
```

### breaklinesParser

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

Result:

```typescript
// <br/>
{
  type: 'br',
  value: ['<br/>'],
  attributes: {},
}
```

### footnoteParser

Parses footnotes / references

import:

```typescript
import {footnoteParser} from 'tiny-marked/lib/parsers/footnote-parser'
```

Example:

```
this is a footnote [^1]


[^1]: it references this
```

Result:

```typescript
// [^note]
{
  type: "footnote",
  value: ["note"],
  attributes: {}
}

// [^note]: result`
{
  type: "footnote",
  value: ["note"],
  attributes: {"end": true}
}

```

### strikethroughParser

Parses strikethroughs

import:

```typescript
import {strikeParser} from 'tiny-marked/lib/parsers/strike-parser'
```

Example:

```
~~text~~
```

Result:

```typescript
// ~~Striked~~
{
  type: 's',
  value: ['Striked'],
  attributes: {},
}
```

### blockParser

Parses blocks / codeblocks

import:

```typescript
import {blockParser} from 'tiny-marked/lib/parsers/block-parser'
```

Example:

````
\```
content
\```
````

Result:

```typescript
// `block`
{
  type: 'code',
  value: ['block'],
  attributes: {},
}
```

# Build string or components

If you want to go through the result and build components, strings, analyze etc, i have two examples provided here.

**First**

Using recursive map, simply run a map function on every child value. This would fit almost every usecase the best.

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
    return `<a href="${data.attributes.href}">${components}</a>`
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
        attributes: {
          href: 'https://example.com',
        },
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
          str += `<a href="${item.attributes.href}">`
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
        attributes: {
          href: 'https://example.com',
        },
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

```
woowHello
```

```typescript
import {createElement} from 'tiny-marked'

// parser type Parser<'woow'> should match createElement('woow', ..)
const woowParser: Parser<'woow'> = ({parseElements}) => {
  return {
    /**
     * Required
     * Add a regex
     * This example matches on "woow" then everything until a space or enter.
     **/
    regex: /(woow[a-z\d-]+)/gim,

    /**
     * Optional
     * Ignore nested parsing by adding name of parsers.
     * example: adding 'boldItalicParser' for linkParser removes abillity of bolded link: **[text](example.se)**
     **/
    ingore: []

    /**
     * Required
     * Add a replacer function, runs on regex match
     * The first param will be id (not an uniq id!)
     * Then matching results from your reges, could be multible match params depending on your regex.
     **/
    replacer: (id, match) => {
      const content = match.slice(4) // get everything after "woow"

      // create your element, this one is called woow
      // pass your content with the matcher removed (remove "wooow")
      // this content can be parsed again so its importat to remove the matcher or endless recursion will occur.
      // You can also use the `ignore` property to prevent self reccursion if needed.
      return createElement('woow', id, parseElements(content), {
        /* place custom attributes here, etc href link */
        custom: 'example',
      })
    },
  }
}

/**
 * match result from woowParser with input "woowHello"
 * [{type: 'woow', value: ['Hello'], attributes: { custom: 'example' } }]
 **/
```
