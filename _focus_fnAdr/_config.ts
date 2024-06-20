// [依赖] : g_appName
// [术语] :  参考 _focus_fnAdr/_impl.ts



//关注其所有函数的模块(暂无)
const _modules_include=[
  "other_module_1.so",
];
// "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
// ldd /app2/sleuthkit/tools/autotools/tsk_recover  | awk '{print " \""$1"\","}'
//讨厌其所有函数的模块
const _modules_exclude:string[]=[
 "linux-vdso.so.1",
 "libpixman-1.so.0",
 "libz.so.1",
 "libgio-2.0.so.0",
 "libgobject-2.0.so.0",
 "libglib-2.0.so.0",
 "libgmodule-2.0.so.0",
 "libm.so.6",
 "libc.so.6",
 "/lib64/ld-linux-x86-64.so.2",
 "libmount.so.1",
 "libselinux.so.1",
 "libffi.so.8",//被qemu大量调用的ffi_call在此模块libffi.so中
 "libpcre.so.3",
 "libblkid.so.1",
 "libpcre2-8.so.0",
];


// objdump --syms /app2/qemu/build-v8.2.2/qemu-system-x86_64  2>/dev/null | grep " F" | egrep -i "varLs|TL_TmPnt"  | awk '{print " \""$6"\","}'
/*去掉awk输出如下
0000000000122610 l     F .text	0000000000000095              _ZSt10accumulateIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEES2_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_0ET0_T_SC_SB_T1_
00000000001226b0 l     F .text	00000000000000a5              _ZSt8for_eachIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_1ET0_T_SC_SB_
0000000000122760 l     F .text	0000000000000062              _ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_0clERK9__VarDeclS4_
00000000001227d0 l     F .text	0000000000000197              _ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_1clE9__VarDecl
0000000000121e80 g     F .text	00000000000000b0              _Z23_init_varLs_inFn__RtCxxNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEES4_ii
00000000001216f0 g     F .text	000000000000004a              TL_TmPnt__update
000000000011e480 g     F .text	0000000000000079              _init_varLs_inFn__RtC00
0000000000121740 g     F .text	0000000000000018              TL_TmPnt__get
000000000011e580 g     F .text	000000000000016f              destroyVarLs_inFn__RtC00
0000000000121760 g     F .text	0000000000000037              TL_TmPnt__printPtr
0000000000121fd0 g     F .text	0000000000000632              _Z24destroyVarLs_inFn__RtCxxP11__VarDeclLs
*/
const _moduleApp__clangVar_runtime_fnNameLs:string[]=[
  "_ZSt10accumulateIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEES2_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_0ET0_T_SC_SB_T1_",
  "_ZSt8for_eachIN9__gnu_cxx17__normal_iteratorIP9__VarDeclSt6vectorIS2_SaIS2_EEEEZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsE3$_1ET0_T_SC_SB_",
  "_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_0clERK9__VarDeclS4_",
  "_ZZ24destroyVarLs_inFn__RtCxxP11__VarDeclLsENK3$_1clE9__VarDecl",
  "_Z23_init_varLs_inFn__RtCxxNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEES4_ii",
  "TL_TmPnt__update",
  "_init_varLs_inFn__RtC00",
  "TL_TmPnt__get",
  "destroyVarLs_inFn__RtC00",
  "TL_TmPnt__printPtr",
  "_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLs",
];


const _moduleApp__exclude_fnNameLs:string[]=[
//跳过qemu的巨量调用函数们
  "pit_irq_timer",
  "generate_memory_topology",
  "ffi_call",

//analyze_by_graph 打印大于1万次调用的函数们（方便返工修改frida_js以跳过大量调用函数）
  "symcmp64",
  "pic_get_irq",
  "pic_update_irq",
  "pic_stat_update_irq",
  "pic_set_irq",
  "apic_accept_pic_intr",
  "pic_irq_request",
  "gsi_handler",
  "ioapic_set_irq",
  "icount_notify_exit",
  "ioapic_stat_update_irq",
  "qemu_timer_notify_cb",
  "pit_get_next_transition_time",
  "hpet_handle_legacy_irq",
  "pit_get_out",
  "pit_irq_timer_update.part.0",

  "victim_tlb_hit",
  "mmu_lookup",		
  "mmu_lookup1",	
  "helper_stb_mmu",
  "helper_ldub_mmu",
];


//本应用自身模块的函数名过滤器 
//    排除clang-var插件的运行时的函数们、排除调用量很大的函数们
const _appFilter:MG_ModuleFilter=MG_ModuleFilter.build_excludeFuncLs(g_appName, [..._moduleApp__clangVar_runtime_fnNameLs, ..._moduleApp__exclude_fnNameLs])
const _moduleFilterLs:MG_ModuleFilter[]=[_appFilter];


