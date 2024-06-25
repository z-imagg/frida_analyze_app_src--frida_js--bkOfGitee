// [描述] 模块的函数名过滤器 配置
// [依赖] : g_appName
// [术语] :  参考 _focus_fnAdr/_impl.ts

// alias alias__fromPipe_rmRepeatBlank_getFieldK_rmBlank_LoopLineAdd2Quotes1comma='tr  --squeeze-repeats " " |tr  --squeeze-repeats "\t" | cut -d" " -f${_fieldK} | tr  --delete " " |tr  --delete "\t" | while IFS= read -r line; do echo "\"$line\","; done  '

//关注其所有函数的模块(暂无)
const _modules_include=[
  "other_module_1.so",
];
//讨厌其所有函数的模块
const _modules_exclude:string[]=[
  //总是要排除frida-agent.so的， 否则frida会自己调用自己 从而陷入 自死循环 中
  "frida-agent-64.so", 
  //排除 linux可执行elf文件的基础依赖
  "linux-vdso.so.1", "libz.so.1", "libc.so.6", "ld-linux-x86-64.so.2",

  // "libstdc++.so.6", "libstdc++.so.6.0.30",  // openjdk-24+0 的 java命令 居然不依赖 libstdc++

  //以下这些是谁带来的?  'ldd ...app.elf' 中貌似没有, 难道是 frida带来的
  "libm.so.6",
  "libpthread.so.0",
  "librt.so.1",
  "libdl.so.2",
  "libgcc_s.so.1"
];

//  grep runtime  /fridaAnlzAp/frida_js/InterceptFnSym-tsk_recover.log
const _fnNameLs__clgVarRuntime__fromFridaJsLog:string[]=[
  "_GLOBAL__sub_I_runtime_cpp__vars_fn.cpp",
];

// 忽略 clangVar 的 c运行时 依赖的 antirez_sds 中所有函数
//  _fieldK=5;  objdump --syms /fridaAnlzAp/clang-var/runtime_c__vars_fn/build/CMakeFiles/clangPlgVar_runtime_c.dir/app/antirez--sds/sds.c.o | grep " F"  | alias__fromPipe_rmRepeatBlank_getFieldK_rmBlank_LoopLineAdd2Quotes1comma
const _fnNameLs__clgVarRuntimeC00_dep_antirezSds:string[]=[
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
// _fieldK=5; objdump --syms  /app/clibs--list/build/libclibs_list.a | grep " F"    | alias__fromPipe_rmRepeatBlank_getFieldK_rmBlank_LoopLineAdd2Quotes1comma
const _fnNameLs__clgVarRuntimeC00_dep_clibsList:string[]=[
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

//跳过runtime_c00中的函数们
// _fieldK=5; objdump --syms  /fridaAnlzAp/clang-var/runtime_c__vars_fn/build/libclangPlgVar_runtime_c.a 2>/dev/null | grep " F" | egrep -i  "RtCxx|TL_TmPnt"    | alias__fromPipe_rmRepeatBlank_getFieldK_rmBlank_LoopLineAdd2Quotes1comma
const _fnNameLs__clgVarRuntimeC00:string[]=[
"_init_varLs_inFn__RtC00",
"createVar__RtC00",
"destroyVarLs_inFn__RtC00",
  ];

//跳过runtime_cxx中的函数们
// _fieldK=5; objdump --syms  /fridaAnlzAp/clang-var/build/runtime_cpp__vars_fn/libclangPlgVar_runtime_cxx.a 2>/dev/null | grep " F" | egrep -i  "RtCxx|TL_TmPnt|fridaHelper"    | alias__fromPipe_rmRepeatBlank_getFieldK_rmBlank_LoopLineAdd2Quotes1comma 
const _fnNameLs__clgVarRuntimeCxx:string[]=[
"_ZSt10accumulateIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEES2_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEE3$_0ET0_T_SJ_SI_T1_",
"_ZSt8for_eachIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEE3$_1ET0_T_SJ_SI_",
"_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEENK3$_0clERK9__VarDeclSB_",
"_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEENK3$_1clE9__VarDecl",
"_Z23_init_varLs_inFn__RtCxxNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEES4_ii",
"_Z16createVar__RtCxxP11__VarDeclLsNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEibi",
"_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEE",
"_Z40fridaHelper__cxxFuncWrap__std_string_newv",
"_Z43fridaHelper__cxxFuncWrap__std_string_deletePv",
"_Z41fridaHelper__cxxFuncWrap__std_string_sizePv",
"_Z41fridaHelper__cxxFuncWrap__std_string_cstrPviPc",
];



const _fnNameLs__clgVarRuntimeC00Cxx:string[]=[
..._fnNameLs__clgVarRuntimeC00_dep_antirezSds,  ..._fnNameLs__clgVarRuntimeC00_dep_clibsList, ..._fnNameLs__clgVarRuntimeC00, 
..._fnNameLs__clgVarRuntimeCxx
 ];
 
//analyze_by_graph 打印大于1万次调用的函数们（方便返工修改frida_js以跳过大量调用函数）
const  _fnNameLs__hugeCallCnt:string[]=[
  //跳过sleuthkit的巨量调用函数们
  
];

// 跳过导致frida崩溃的函数
const  _fnNameLs__libjvm__causeFridaCrash:string[]=[
  "SafeFetch32_impl",
/* 
  Error: unable to intercept function at 0x7fffdb739610; please file a bug  (不确定 升级frida版本能否避免 ，等完事后可以试一试)
      at value (frida/runtime/core.js:367)
      at _main_ (/fridaAnlzAp/frida_js/InterceptFnSym_generated.js:847)
      at _entry (/fridaAnlzAp/frida_js/InterceptFnSym_generated.js:926)
      at apply (native)
      at <anonymous> (frida/runtime/core.js:51)

  DebugSymbol.fromAddress(new NativePointer("0x7fffdb739610"))
  {
      "address": "0x7fffdb739610",
      "column": 0,
      "fileName": "",
      "lineNumber": 0,
      "moduleName": "libjvm.so",
      "name": "SafeFetch32_impl"
  }

*/
"_SafeFetch32_continuation",
/* 
  0x7fffdb739613 报错同上
  DebugSymbol.fromAddress(new NativePointer("0x7fffdb739613"))
{
    "address": "0x7fffdb739613",
    "column": 0,
    "fileName": "",
    "lineNumber": 0,
    "moduleName": "libjvm.so",
    "name": "_SafeFetch32_continuation"
}
*/
  
];

//  openjdk-24+0 的 java命令 的 静态依赖 、 动态依赖 请参考 :  https://prgrmz07.coding.net/p/app/d/jdk/git/tree/brch_jdk-24%2B0__cmdWrapBuildByClangVar_2024_0625_1358/_build_/test.sh
// 静态依赖
// _fieldK=1; ldd /app2/jdk-jdk-24-0/build_home/jdk/bin/java  | alias__fromPipe_rmRepeatBlank_getFieldK_rmBlank_LoopLineAdd2Quotes1comma
// "libjli.so", 
// 动态依赖
// "libjvm.so", "libjimage.so", "libjava.so", "libjsvml.so", "libnio.so", "libnet.so",  
  

// 各模块 对 clangVarRuntimeC00、clangVarRuntimeCxx 函数 更精细的 依赖 ， 请参考 : https://prgrmz07.coding.net/p/app/d/jdk/git/tree/brch_jdk-24%2B0__cmdWrapBuildByClangVar_2024_0625_1358/_build_/find__clangVar_runtime_fn.out.txt
// 以下过滤器, 是 让每个模块 都 跳过 clangVarRuntimeC00、clangVarRuntimeCxx 中 所有函数

//openjdk-24的java命令 的 各模块的函数名过滤器 
const _moduleFilterLs:MG_ModuleFilter[]=[
MG_ModuleFilter.build_excludeFuncLs(g_appName, [..._fnNameLs__clgVarRuntimeC00Cxx]),
MG_ModuleFilter.build_excludeFuncLs("libjli.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx]),
MG_ModuleFilter.build_excludeFuncLs("libjvm.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__libjvm__causeFridaCrash]),
MG_ModuleFilter.build_excludeFuncLs("libjimage.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx]),
MG_ModuleFilter.build_excludeFuncLs("libjava.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx]),
MG_ModuleFilter.build_excludeFuncLs("libjsvml.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx]),
MG_ModuleFilter.build_excludeFuncLs("libnio.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx]),
MG_ModuleFilter.build_excludeFuncLs("libnet.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx]),
];

// 之后 _wrap.ts 中 组装出 最终使用的过滤器 mg_moduleFilter_ls  如下所示 
/*
const mg_moduleFilter_ls: MG_ModuleFilter[]=[
  ..._moduleFilterLs, //一般模块过滤器们
  ..._modules_exclude, //讨厌其所有函数的模块
  ..._modules_include //关注其所有函数的模块
];
 */
