import compiler from './compiler';

test('Inserts name and outputs Javascript', async () => {
  expect.assertions(1);

  const stats = await compiler("i18n/i18n.properties");
  const output = stats.toJson().modules[0].source;

  const expectedRes = {
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
  };

  expect(output).toBe(`export default ${JSON.stringify(expectedRes)};`);
});

test('only return desired locales', async () => {
  expect.assertions(1);

  const stats = await compiler("i18n/i18n.properties", { locales: ['en'] });
  const output = stats.toJson().modules[0].source;

  const expectedRes = {
    default: {
      hello: '你好',
      'invoice.title': '发票抬头',
      'app.name': '测试 App'
    },
    en: {
      hello: 'hello',
      'invoice.title': 'invoice title',
      'app.name': '测试 App'
    }
  };

  expect(output).toBe(`export default ${JSON.stringify(expectedRes)};`);
});

test('use custom file pattern', async () => {
  expect.assertions(1);

  const stats = await compiler("message/message.properties", { filePattern: /message(?:_([a-zA-Z_]+))?\.properties$/ });
  const output = stats.toJson().modules[0].source;

  const expectedRes = {
    default: {
      hello: '你好',
      'invoice.title': '发票抬头',
      'app.name': '测试 App'
    },
    en: {
      hello: 'hello',
      'invoice.title': 'invoice title',
      'app.name': '测试 App'
    }
  };

  expect(output).toBe(`export default ${JSON.stringify(expectedRes)};`);
});

test('without default messages', async () => {
  expect.assertions(1);

  const stats = await compiler("i18n2/i18n_en.properties", { filePattern: /i18n(?:_([a-zA-Z_]+))?\.properties$/ });
  const output = stats.toJson().modules[0].source;

  const expectedRes = {
    en: {
      hello: 'hello',
      'invoice.title': 'invoice title'
    },
    fr: {
      fr: 'fr'
    }
  };

  expect(output).toBe(`export default ${JSON.stringify(expectedRes)};`);
});
