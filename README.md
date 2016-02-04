# node-opml-parser

[![build status](https://travis-ci.org/akupila/node-opml-parser.svg?branch=master)](https://travis-ci.org/akupila/node-opml-parser)
[![Coverage Status](https://coveralls.io/repos/github/akupila/node-opml-parser/badge.svg?branch=master)](https://coveralls.io/github/akupila/node-opml-parser?branch=master)

Parses an OPML feed into flat list of items.

## Output format

Each item in the OPML feed is added to an array

```json
[
  {
    "title": "<Feed title>",
    "url": "<Feed url>",
    "feedUrl": "<Feed feed url>",
    "feedType": "<Feed type, rss or similar>"
  }
]
```

## Installation

```
npm install --save node-opml-parser
```

## Usage

```js
const parseOpml = require('node-opml-parser');

parsePodcast('<opml xml>', (err, items) => {
  if (err) {
    console.error(err);
    return;
  }

  // items is a flat array of all items in opml
  console.log(items);
});
```

## Test

```
npm run test
```

## Coverage

```
npm run cover
```

## Duplicates

In case duplicates are found they are removed. The matching is done based on feed url so anything else can differ.

## Folders

OPML can contain a directory structure but it is ignored here; a flat structure is always returned back.

## Titles

In case multiple inconsistent titles are found only one is picked.

Precedence:

  1. title
  2. text
  3. description

## Additional notes

The parser just tries to find items quite aggressively so it doesn't care too much about structure. 
This means an incorrectly formatted OPML feed might still contain items, make sure the input is not too broken.

**This should not be used to validate OPML feeds!**

## Blogs vs podcasts

OPML doesn't distinguish between feeds for blogs or podcasts so there's not really a way to know without downloading the feed url and looking for enclosures.
This module doesn't make any effort trying to separate what's what.
