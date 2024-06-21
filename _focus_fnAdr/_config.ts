// [描述] 模块的函数名过滤器 配置
// [依赖] : g_appName
// [术语] :  参考 _focus_fnAdr/_impl.ts



//关注其所有函数的模块(暂无)
const _modules_include=[
  "other_module_1.so",
];
// "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
// ldd /fridaAnlzAp/frida_js_demo/app.elf  | awk '{print " \""$1"\","}'
//讨厌其所有函数的模块
const _modules_exclude:string[]=[
  //总是要排除frida-agent.so的， 否则frida会自己调用自己 从而陷入 自死循环 中
  "frida-agent-64.so", 
  //排除 linux可执行elf文件的基础依赖
  "linux-vdso.so.1",
  // "libstdc++.so.6",
  "libz.so.1",
  "libm.so.6",
  "libgcc_s.so.1",
  "libc.so.6",
  "ld-linux-x86-64.so.2",

  //以下这些是谁带来的?  'ldd ...app.elf' 中貌似没有, 难道是 frida带来的
  "libpthread.so.0",
  "librt.so.1",
  "libdl.so.2"
];


// objdump --syms /app2/sleuthkit/tools/autotools/tsk_recover  2>/dev/null | grep " F" | egrep -i "varLs|TL_TmPnt"  | awk '{print " \""$6"\","}'
const _moduleApp__clangVar_runtime_fnNameLs:string[]=[
  "_ZSt10accumulateIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEES2_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEE3$_0ET0_T_SJ_SI_T1_",
  "_ZSt8for_eachIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEE3$_1ET0_T_SJ_SI_",
  "_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEENK3$_0clERK9__VarDeclSB_",
  "_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEENK3$_1clE9__VarDecl",
  "_Z23_init_varLs_inFn__RtCxxNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEES4_ii",
  "TL_TmPnt__update",
  "_init_varLs_inFn__RtC00",
  "TL_TmPnt__get",
  "_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEE",
  "destroyVarLs_inFn__RtC00",
  "TL_TmPnt__printPtr",
 
];


// 忽略 clangVar 的 c运行时 依赖的 antirez_sds 中所有函数
//  objdump --syms /app2/sleuthkit/tools/autotools/tsk_recover  2>/dev/null | grep " F" | awk '{print " \""$6"\","}' | tr -d ' '  | grep '^"sds'
//  objdump --syms /fridaAnlzAp/clang-var/runtime_c__vars_fn/build/CMakeFiles/clangPlgVar_runtime_c.dir/app/antirez--sds/sds.c.o | grep " F"  | awk '{print " \""$6"\","}'
const _moduleApp__clangVar_runtime_c_dependency_antirezSds_fnNameLs:string[]=[
  "sdsReqType",
  "sdsHdrSize",
  "sdslen",
  "sdssetlen",
  "sdsavail",
  "sdssetalloc",
  "sdsalloc",
  "sdsinclen",
  "sdsnewlen",
  "sdsempty",
  "sdsnew",
  "sdsdup",
  "sdsfree",
  "sdsupdatelen",
  "sdsclear",
  "sdsMakeRoomFor",
  "sdsRemoveFreeSpace",
  "sdsAllocSize",
  "sdsAllocPtr",
  "sdsIncrLen",
  "sdsgrowzero",
  "sdscatlen",
  "sdscat",
  "sdscatsds",
  "sdscpylen",
  "sdscpy",
  "sdsll2str",
  "sdsull2str",
  "sdsfromlonglong",
  "sdscatvprintf",
  "sdscatprintf",
  "sdscatfmt",
  "sdstrim",
  "sdsrange",
  "sdstolower",
  "sdstoupper",
  "sdscmp",
  "sdssplitlen",
  "sdsfreesplitres",
  "sdscatrepr",
  "is_hex_digit",
  "hex_digit_to_int",
  "sdssplitargs",
  "sdsmapchars",
  "sdsjoin",
  "sdsjoinsds",
  "sds_malloc",
  "sds_realloc",
  "sds_free",
];

// 忽略 clangVar 的 c运行时 依赖的 libclibs_list 中所有函数
// objdump --syms  /app/clibs--list/build/libclibs_list.a | grep " F"    | awk '{print " \""$6"\","}'
const _moduleApp__clangVar_runtime_c_dependency_clibsList_fnNameLs:string[]=[
  "list_new",
  "list_destroy",
  "list_rpush",
  "list_rpop",
  "list_lpop",
  "list_lpush",
  "list_find",
  "list_at",
  "list_remove",
  "list_node_new",
  "list_iterator_new",
  "list_iterator_new_from_node",
  "list_iterator_next",
  "list_iterator_destroy",
];

const _moduleApp__exclude_fnNameLs:string[]=[
//跳过sleuthkit的巨量调用函数们
//   sleuthkit暂无巨量调用函数

//analyze_by_graph 打印大于1万次调用的函数们（方便返工修改frida_js以跳过大量调用函数）
//   sleuthkit暂无调用次数大于1万次的函数
];


//本应用自身模块的函数名过滤器 
//    排除clang-var插件的运行时的函数们、排除调用量很大的函数们
const _appFilter:MG_ModuleFilter=MG_ModuleFilter.build_excludeFuncLs(g_appName, [..._moduleApp__clangVar_runtime_fnNameLs, ..._moduleApp__exclude_fnNameLs, ..._moduleApp__clangVar_runtime_c_dependency_antirezSds_fnNameLs, ..._moduleApp__clangVar_runtime_c_dependency_clibsList_fnNameLs])
const _moduleFilterLs:MG_ModuleFilter[]=[_appFilter];

// 之后 _wrap.ts 中 组装出 最终使用的过滤器 mg_moduleFilter_ls  如下所示 
/*
const mg_moduleFilter_ls: MG_ModuleFilter[]=[
  ..._moduleFilterLs, //一般模块过滤器们
  ..._modules_exclude, //讨厌其所有函数的模块
  ..._modules_include //关注其所有函数的模块
];
 */
