# babel-plugin-aop
A babel plugin for replacing import's module.

一个用于替换项目中 import 的 babel 插件。

# Installation

    npm install --save-dev babel-plugin-aop

# Usage

add babel-plugin-aop in '.babelrc'.

在 .babelrc 文件中添加 babel-plugin-aop。
```js
{
    ...
    "plugins": [
        ...
        ["aop", {"replaceImports": [{"component": "useTranslation", "module": "react-i18next", "replaceStr": "import useTranslation from '@/utils/i18next/i18n-wrapper';"}]}]
    ]
}
```
### component : 

import module's  export.

导入 module 对外输入的模块


### module: 

import's module name.

导入 module 的名称。

### replaceStr: 

new import statement.

新的引用语句。

# Sample code

```ts
// i18n-wrapper.ts
export default function useTranslation(): {t: (str: string) => string}{
    return {t: (str: string) => {return 'replace by i18n-wrapper.'}}
}
```
