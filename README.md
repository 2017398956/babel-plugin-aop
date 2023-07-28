# babel-plugin-aop
A babel plugin for replacing import's module.

一个用于替换项目中 import 的 babel 插件。

# Installation

    npm install --save-dev babel-plugin-aop

# Usage

add babel-plugin-aop in '.babelrc'.

在 .babelrc 文件中添加 babel-plugin-aop。

### 1.use tsconfig's compilerOptions.paths:

```js

{
    ...
    "plugins": [
        ...
        ["aop",
            {"replaceImports":
                [
                    {
                        "component":"useTranslation",
                        "module": "react-i18next",
                        "replaceStr": "import useTranslation from '@/utils/i18next/i18n-wrapper';"
                    }
                ]
            }
        ]
    ]
}
```
In react native, A babel plugin (https://reactnative.dev/docs/typescript#using-custom-path-aliases-with-typescript, https://github.com/tleunen/babel-plugin-module-resolver) for tsconfig's compilerOptions.paths may help you. if it doesn't work, try

```sh
npx react-native start --reset-cache
```

once and then

    yarn android

works.

// or use a path start with './'

{
    ...
    "plugins": [
        ...
        ["aop", 
            {"replaceImports": 
                [
                    {
                        "component": "useTranslation",
                        "module": "react-i18next",
                        "replaceStr": "import useTranslation from",
                        "path": "./src/test/utils/i18next/i18n-wrapper"
                    }
                ]
            }
        ]
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

# exclude config

add 
```js
/*exclude aop:[{"component":"testComponent", "module":"testModule"}]*/
```
in your js or ts file.It will be very useful in a wrapped component.
# Sample code

```ts
// i18n-wrapper.ts
export default function useTranslation(): {t: (str: string) => string}{
    return {t: (str: string) => {return 'replace by i18n-wrapper.'}}
}
```
