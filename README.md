# i18n properties message loader for webpack

[![Build Status](https://travis-ci.org/liunian/message-loader.svg?branch=master)](https://travis-ci.org/liunian/message-loader)

[![Coverage Status](https://coveralls.io/repos/github/liunian/message-loader/badge.svg?branch=master)](https://coveralls.io/github/liunian/message-loader?branch=master)

When import / require `i18n.properties`, import all other properties files in the same directory, and output as json.

## Usage

```bash
npm i message-loader -D
```

### Add `message-loader` into webpack config.

```js
{
  module: {
    rules: [
      {
        test: /i18n[a-zA-Z_]*\.properties$/,
        use: 'message-loader'
      }
    ]
  }
}
```

### src/i18n/i18n.properties

> default properties

```
hello = 你好
invoice.title = 发票抬头
app.name = 测试 App
```

### src/i18n/i18n_en.properties

```
hello = hello
invoice.title = invoice title
```

### src/i18n/i18n_fr.properties

```
fr = fr
```

### src/index.js

```js
import messages from './i18n/i18n.properties';

console.log(messages);

// should output following code
/*

{
  default: {
    hello: '你好',
    'invoice.title': '发票抬头',
    'app.name': '测试 App'
  },
  en: {
    hello: 'hello',
    'invoice.title': 'invoice title',
    'app.name': '测试 App'
  },
  fr: {
    hello: '你好',
    'invoice.title': '发票抬头',
    'app.name': '测试 App',
    fr: 'fr'
  }
}
*/
``` 

## options

Override default options with following loader config.

```js
{
  test: /message(?:_([a-zA-Z_]+))?\.properties$/,
  use: {
    loader: 'message-loader',
    options: {
      filePattern: /message(?:_([a-zA-Z_]+))?\.properties$/,
      locales: ['en']
    }
  }
}
```

### options.filePattern

default to: `/i18n(?:_([a-zA-Z_]+))?\.properties$/`.

Means will search following files in the same directory, `i18n.properties`, `i18n_en.properties`, `i18n_zh_CN.properties`, and so on.

when use file name to match pattern, the result at index `1` will be the locale.

### options.locales

Should be an array with locale string, e.g. `['en', 'zh_CN']`.

Means only specific locale messages will be returned, **Notice: default message will be return if exist.**
