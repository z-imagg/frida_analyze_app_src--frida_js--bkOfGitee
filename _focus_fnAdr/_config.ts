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
  // openjdk-24/jdk/bin/java  跳过 大于1万次调用的函数们 （analyze_by_graph将fridaLog转为sqlite3后执行统计sql获得 ），  参考 http://giteaz:3000/frida_analyze_app_src/analyze_by_graph/src/commit/276d6f90fcf97ba5cfbb00184f745c7db82101d7/fridaLog-sqlite3-java.log.txt
  "_ZNSt15basic_streambufIcSt11char_traitsIcEE6xsputnEPKcl",
  "_ZNSo6sentryC1ERSo",
  "_ZSt16__ostream_insertIcSt11char_traitsIcEERSt13basic_ostreamIT_T0_ES6_PKS3_l",
  "_ZStlsISt11char_traitsIcEERSt13basic_ostreamIcT_ES5_PKc",
  "_ZNK9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS1_SaIS1_EEE4baseEv",
  "_ZNKSt6locale2id5_M_idEv",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEED2Ev",
  "_Znwm",
  "_ZdlPv",
  "_ZN9__VarDeclD2Ev",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEE9_M_createERmm",
  "_ZNKSt7num_putIcSt19ostreambuf_iteratorIcSt11char_traitsIcEEE13_M_insert_intIlEES3_S3_RSt8ios_basecT_",
  "_ZSt13__int_to_charIcmEiPT_T0_PKS0_St13_Ios_Fmtflagsb",
  "_ZNKSt11__use_cacheISt16__numpunct_cacheIcEEclERKSt6locale.isra.0",
  "_ZN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS1_SaIS1_EEEC2ERKS2_",
  "_ZSt12__niter_baseIP9__VarDeclET_S2_",
  "_ZNSo9_M_insertIlEERSoT_",
  "_ZNKSt7num_putIcSt19ostreambuf_iteratorIcSt11char_traitsIcEEE6do_putES3_RSt8ios_basecl",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEC1Ev",
  "_ZNSolsEi",
  "_ZN9__gnu_cxxneIP9__VarDeclSt6vectorIS1_SaIS1_EEEEbRKNS_17__normal_iteratorIT_T0_EESB_",
  "_ZNKSt6vectorI9__VarDeclSaIS0_EE4sizeEv",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEC1ERKS4_",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEE12_M_constructIPcEEvT_S7_St20forward_iterator_tag",
  "_ZN9__VarDeclC2ERKS_",
  "_ZN9__VarDeclC2Ev",
  "_ZNSt6localeC1Ev",
  "_ZNSt6locale13_S_initializeEv",
  "_ZNSt6localeD1Ev",
  "_ZNSt6vectorI9__VarDeclSaIS0_EE3endEv",
  "_ZNSt6vectorI9__VarDeclSaIS0_EE5beginEv",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEaSERKS4_",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEE9_M_assignERKS4_",
  "_ZNK9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS1_SaIS1_EEEdeEv",
  "_ZN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS1_SaIS1_EEEppEv",
  "_ZNKSt15__new_allocatorI9__VarDeclE11_M_max_sizeEv",
  "_ZStlsIcSt11char_traitsIcESaIcEERSt13basic_ostreamIT_T0_ES7_RKNSt7__cxx1112basic_stringIS4_S5_T1_EE",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EE19_M_get_Tp_allocatorEv",
  "_ZSt9has_facetISt5ctypeIcEEbRKSt6locale",
  "_ZSt9use_facetISt5ctypeIcEERKT_RKSt6locale",
  "_ZSt9has_facetISt7num_putIcSt19ostreambuf_iteratorIcSt11char_traitsIcEEEEbRKSt6locale",
  "_ZSt9has_facetISt7num_getIcSt19istreambuf_iteratorIcSt11char_traitsIcEEEEbRKSt6locale",
  "_ZSt9use_facetISt7num_putIcSt19ostreambuf_iteratorIcSt11char_traitsIcEEEERKT_RKSt6locale",
  "_ZSt9use_facetISt7num_getIcSt19istreambuf_iteratorIcSt11char_traitsIcEEEERKT_RKSt6locale",
  "_ZNSt8ios_base7_M_initEv",
  "_ZNSt9basic_iosIcSt11char_traitsIcEE4initEPSt15basic_streambufIcS1_E",
  "_ZNSt9basic_iosIcSt11char_traitsIcEE15_M_cache_localeERKSt6locale",
  "_ZNSt6localeaSERKS_",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEC1EOS4_",
  "_ZN9__VarDeclC2EOS_",
  "_ZSt14__relocate_a_1IP9__VarDeclS1_SaIS0_EET0_T_S4_S3_RT1_",
  "_ZSt12__relocate_aIP9__VarDeclS1_SaIS0_EET0_T_S4_S3_RT1_",
  "_ZNKSt15__new_allocatorI9__VarDeclE8max_sizeEv",
  "_ZSt3minImERKT_S2_S2_",
  "_ZNSt16allocator_traitsISaI9__VarDeclEE8max_sizeERKS1_",
  "_ZNKSt12_Vector_baseI9__VarDeclSaIS0_EE19_M_get_Tp_allocatorEv",
  "_ZNSt6vectorI9__VarDeclSaIS0_EE11_S_max_sizeERKS1_",
  "_ZNKSt6vectorI9__VarDeclSaIS0_EE8max_sizeEv",
  "_ZNSt6vectorI9__VarDeclSaIS0_EE11_S_relocateEPS0_S3_S3_RS1_",
  "_ZN9__gnu_cxxmiIP9__VarDeclSt6vectorIS1_SaIS1_EEEENS_17__normal_iteratorIT_T0_E15difference_typeERKS9_SC_",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EE13_M_deallocateEPS0_m",
  "_ZNSt15__new_allocatorI9__VarDeclE9constructIS0_JRKS0_EEEvPT_DpOT0_",
  "_ZNSt16allocator_traitsISaI9__VarDeclEE9constructIS0_JRKS0_EEEvRS1_PT_DpOT0_",
  "_ZNSt6vectorI9__VarDeclSaIS0_EE9push_backERKS0_",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEaSEOS4_",
  "_ZNSolsEb",
  "_ZNSo9_M_insertIbEERSoT_",
  "_ZNKSt7num_putIcSt19ostreambuf_iteratorIcSt11char_traitsIcEEE6do_putES3_RSt8ios_basecb",
  "_ZN9__VarDeclaSEOS_",
//   "_ZSt8_DestroyI9__VarDeclEvPT_",
  "_ZNSt7__cxx1115basic_stringbufIcSt11char_traitsIcESaIcEE8overflowEi",
  "_ZNSt7__cxx1115basic_stringbufIcSt11char_traitsIcESaIcEE8_M_pbumpEPcS5_l",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEE10_M_replaceEmmPKcm",
//   "_ZNSt15__new_allocatorI9__VarDeclE7destroyIS0_EEvPT_",
  "_ZNSt15__new_allocatorI9__VarDeclE9constructIS0_JS0_EEEvPT_DpOT0_",
  "_ZNSt16allocator_traitsISaI9__VarDeclEE9constructIS0_JS0_EEEvRS1_PT_DpOT0_",
  "_ZSt19__relocate_object_aI9__VarDeclS0_SaIS0_EEvPT_PT0_RT1_",
//   "_ZNSt16allocator_traitsISaI9__VarDeclEE7destroyIS0_EEvRS1_PT_",
  "_ZNSt15__new_allocatorI9__VarDeclE8allocateEmPKv",
  "_ZNSt16allocator_traitsISaI9__VarDeclEE8allocateERS1_m",
  "_ZSt3maxImERKT_S2_S2_",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EE11_M_allocateEm",
  "_ZNKSt6vectorI9__VarDeclSaIS0_EE12_M_check_lenEmPKc",
  "_ZNSt6vectorI9__VarDeclSaIS0_EE17_M_realloc_insertIJRKS0_EEEvN9__gnu_cxx17__normal_iteratorIPS0_S2_EEDpOT_",
  "_ZNSt15__new_allocatorI9__VarDeclE10deallocateEPS0_m",
  "_ZNSt16allocator_traitsISaI9__VarDeclEE10deallocateERS1_PS0_m",
  "TL_TmPnt__get",
  "_ZNSt15__new_allocatorI9__VarDeclEC2Ev",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EE17_Vector_impl_dataC2Ev",
  "_ZNSaI9__VarDeclEC2Ev",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EE12_Vector_implC2Ev",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EEC2Ev",
  "_ZNSt6vectorI9__VarDeclSaIS0_EEC2Ev",
  "_ZN11__VarDeclLsC2Ev",
  "_ZSt19__iterator_categoryIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEENSt15iterator_traitsIT_E17iterator_categoryERKS9_",
  "_ZSt10__distanceIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEENSt15iterator_traitsIT_E15difference_typeES9_S9_St26random_access_iterator_tag",
  "_ZSt8distanceIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEENSt15iterator_traitsIT_E15difference_typeES9_S9_",
  "_ZNSt15__new_allocatorI9__VarDeclED2Ev",
  "_ZNSaI9__VarDeclED2Ev",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EE12_Vector_implD2Ev",
  "_ZNSt12_Vector_baseI9__VarDeclSaIS0_EED2Ev",
//   "_ZNSt12_Destroy_auxILb0EE9__destroyIP9__VarDeclEEvT_S4_",
//   "_ZSt8_DestroyIP9__VarDeclEvT_S2_",
//   "_ZSt8_DestroyIP9__VarDeclS0_EvT_S2_RSaIT0_E",
  "_ZN11__VarDeclLsD2Ev",
  "_ZNSt6vectorI9__VarDeclSaIS0_EED2Ev",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEE4swapERS4_",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEE7reserveEm",
  "_ZNSt7__cxx1115basic_stringbufIcSt11char_traitsIcESaIcEE7_M_syncEPcmm",
  "_ZNSt7__cxx1118basic_stringstreamIcSt11char_traitsIcESaIcEEC1Ev",
  "_ZNSolsEl",
  "_ZNSt8ios_baseC2Ev",
  "_ZNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEE9_M_mutateEmmPKcm",
  "_ZNKSt7__cxx1118basic_stringstreamIcSt11char_traitsIcESaIcEE3strEv",
  "_ZNSt7__cxx1118basic_stringstreamIcSt11char_traitsIcESaIcEED1Ev",
  "_ZNSt8ios_baseD2Ev",
  "_ZNSt8ios_base20_M_dispose_callbacksEv",
  "_ZNSt8ios_base17_M_call_callbacksENS_5eventE",
];

// 跳过导致frida崩溃的函数
const  _fnNameLs__libjvm__causeFridaCrash:string[]=[
  "SafeFetch32_impl", "_SafeFetch32_continuation", "SafeFetchN_impl" ,"_SafeFetchN_continuation", 
  /* 报错举例
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

    一次性 多获取一些
    DebugSymbol.findFunctionsMatching("*SafeFetch*").map(f=>DebugSymbol.fromAddress(f))
  
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
MG_ModuleFilter.build_excludeFuncLs(g_appName, [..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__hugeCallCnt]),
MG_ModuleFilter.build_excludeFuncLs("libjli.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__hugeCallCnt]),
MG_ModuleFilter.build_excludeFuncLs("libjvm.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__libjvm__causeFridaCrash, ..._fnNameLs__hugeCallCnt]),
MG_ModuleFilter.build_excludeFuncLs("libjimage.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__hugeCallCnt]),
MG_ModuleFilter.build_excludeFuncLs("libjava.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__hugeCallCnt]),
MG_ModuleFilter.build_excludeFuncLs("libjsvml.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__hugeCallCnt]),
MG_ModuleFilter.build_excludeFuncLs("libnio.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__hugeCallCnt]),
MG_ModuleFilter.build_excludeFuncLs("libnet.so", [ ..._fnNameLs__clgVarRuntimeC00Cxx, ..._fnNameLs__hugeCallCnt]),
];

// 之后 _wrap.ts 中 组装出 最终使用的过滤器 mg_moduleFilter_ls  如下所示 
/*
const mg_moduleFilter_ls: MG_ModuleFilter[]=[
  ..._moduleFilterLs, //一般模块过滤器们
  ..._modules_exclude, //讨厌其所有函数的模块
  ..._modules_include //关注其所有函数的模块
];
 */
