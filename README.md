[![npm version](https://badge.fury.io/js/mtl-file-parser.svg)](https://badge.fury.io/js/mtl-file-parser)
[![Build Status](https://travis-ci.org/WesUnwin/mtl-file-parser.svg?branch=master)](https://travis-ci.org/WesUnwin/mtl-file-parser)

# mtl-file-parser
Material Template Library File (.MTL) Parser

## Installation

```javascript
npm install --save mtl-file-parser
```

## Usage

```javascript
const MTLFile = require('mtl-file-parser');

const fileContents =
  'newmtl green_material\n' +
  'Ka 0 1 0\n' +
  'map_ka /path/to/ka.png';

const mtlFile = new MTLFile(fileContents);

const output = mtlFile.parse(); // see description below
```

## Output
The extracted materials are returned in the following format:

```
[
  {
    name: 'green_material',
    illum: 0,
    Ka: {
      method: 'rgb',
      red: 0,
      green: 1,
      blue: 0
    },
    Kd: {
      method: 'rgb',
      red: 0,
      green: 0,
      blue: 0
    },
    Ks: {
      method: 'ks',
      red: 0,
      green: 0,
      blue: 0
    },
    map_Ka: {
      file: '/path/to/ka.png'
    },
    map_Kd: {
      file: null
    },
    map_Ks: {
      file: null
    }
  },
  {
    ...
  }
]
```

## More to come
mtl-file-parser is actively being developed, and does not yet have full support of the MTL file specification.
Your comments, feedback and bug reports are welcome and appreciated. Thank you!

## Donation
If this project is helping you and you want to see more, please help support the development of
this and other related libraries!

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/WesUnwin)
