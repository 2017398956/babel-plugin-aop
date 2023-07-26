import { declare } from '@babel/helper-plugin-utils';

export default declare((api, options, dirname) => {
    api.assertVersion(7);
    return {
        visitor: {
            Program: {
                enter(path, state) {
                    path.traverse({
                        ImportDeclaration(p) {
                            const source = p.node.source.value;
                            options.replaceImports?.forEach((replaceImport) => {
                                if(source === replaceImport.module){
                                    let delIndex = -1;
                                    p.node.specifiers.forEach((value, index) => {
                                        if(replaceImport.component === value.imported.name){
                                            delIndex = index;
                                            return;
                                        }
                                    });
                                    if(delIndex > -1){
                                        p.node.specifiers.splice(delIndex, 1);
                                        let insertIndex = -1;
                                        path.node.body.forEach((value, index) => {
                                            if(value.type === 'ImportDeclaration' && value.source.value === source){
                                                insertIndex = index + 1;
                                                return;
                                            }
                                        });
                                        if(insertIndex > -1){
                                            path.node.body.splice(insertIndex, 0, api.template.ast(replaceImport.replaceStr));
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
    }
});
