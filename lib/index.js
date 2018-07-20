/**
 * i18n message loader for webpack
 */

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const loaderUtils = require('loader-utils');
const properties = require('java-properties');

// 默认文案文件的正则
const defaultFilePtn = /i18n(?:_([a-zA-Z_]+))?\.properties$/;

function propsFileToJson(props) {
  const result = {};

  props.getKeys().forEach(function (key) {
    result[key] = props.get(key);
  });

  return result;
}

function propertiesFileAsJson(propFilePath) {
  return propsFileToJson(properties.of(propFilePath));
}

module.exports = function(source) {
  const options = loaderUtils.getOptions(this) || {};

  if (options.locales) {
    assert(Array.isArray(options.locales), 'options.locales should be an array if exist, e.g. ["zh", "en_US"]');
  }

  const filePtn = options.filePattern || defaultFilePtn;

  const callback = this.async();

  const propFile = this.resourcePath;
  const dir = path.dirname(propFile);

  // 保留所有的文案，key 是 locale，如 i18n_zh_CN.properties 的 locale 是 zh_CN
  const messages = {};

  fs.readdir(dir, (err, files) => {
    if (err) return callback(err);

    const messageFiles = files.filter(file => filePtn.test(file));

    let defaultMessageFile = null;

    // 找到没带 locale 的作为默认的文案
    for (let f of messageFiles) {
      if (!f.match(filePtn)[1]) {
        defaultMessageFile = f;
        messages.default = propertiesFileAsJson(path.join(dir, f));
        break;
      }
    }

    messageFiles.forEach(f => {
      if (f !== propFile) {
        this.addDependency(path.join(dir, f));
      }

      if (f === defaultMessageFile) return;

      const locale = f.match(filePtn)[1];

      // 如果配置了 locales，那么只添加配置完全匹配的 locales
      // default 如果存在，一定会添加（前面已添加）
      if (options.locales && !options.locales.includes(locale)) {
        return;
      }

      const localeMessages = propertiesFileAsJson(path.join(dir, f));

      if (defaultMessageFile) {
        messages[locale] = Object.assign({}, messages.default, localeMessages);
      } else {
        messages[locale] = localeMessages;
      }
    });

    callback(null, `export default ${JSON.stringify(messages)};`);
  });
};
