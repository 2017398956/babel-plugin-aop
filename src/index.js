import { declare } from '@babel/helper-plugin-utils';

const excludeAopPrefix = 'exclude aop:';

export default declare((api, options, dirname) => {
    api.assertVersion(7);
    return {
        visitor: {
            Program: {
                enter(path, state) {
                    const leadingComment = (path.node.body[0]?.leadingComments || [{value: ''}])[0].value;
                    let excludeAop = [{component: undefined, module: undefined}];
                    if(leadingComment.startsWith(excludeAopPrefix)){
                        excludeAop = JSON.parse(leadingComment.substring(excludeAopPrefix.length));
                    }else{
                        excludeAop = undefined;
                    }

                    path.traverse({
                        ImportDeclaration(p) {
                            const source = p.node.source.value;
                            options.replaceImports?.forEach((replaceImport) => {
                                if(source === replaceImport.module){
                                    let delIndex = -1;
                                    p.node.specifiers.forEach((value, index) => {
                                        if(replaceImport.component === (value?.local || {name: undefined})?.name){
                                            delIndex = index;
                                            return;
                                        }
                                    });
                                    let isExcludeP = false;
                                    if(excludeAop){
                                        excludeAop.forEach(value => {
                                            if(value.module === replaceImport.module && value.component === replaceImport.component){
                                                isExcludeP = true;
                                                return;
                                            }
                                        });
                                    }
                                    if(delIndex > -1 && !isExcludeP){
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
