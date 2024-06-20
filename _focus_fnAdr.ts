// [依赖] : 无


/**
ldd /app/可执行elf文件路径
        linux-vdso.so.1 (0x00007ffff7fc1000)
        libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007ffff6323000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ffff60fa000)
        /lib64/ld-linux-x86-64.so.2 (0x00007ffff7fc3000)
        libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007ffff608a000)
        其他被依赖的so们
*/

//关注模块
const _modules_include=[
  "other_module_1.so",
];
// "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
// ldd /app/可执行elf文件路径 | awk '{print " \""$1"\","}'
//排除模块
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

//是否关注该函数
function focus_fnAdr(fnAdr:NativePointer, _g_appName:string){
  const fnSym=DebugSymbol.fromAddress(fnAdr);
  const moduleName = fnSym.moduleName
  if(moduleName==null){
    throw new Error(`【断言失败】moduleName为null`)
  }

  //不关注名为空的函数
  if (fnSym.name==null || fnSym.name==undefined){
    console.log(`##不关注名为空的函数.fnAdr=[${fnAdr}]`)
    return false;
  }

// 解决frida拦截目标进程中途崩溃 步骤  == frida_js_skip_crashFunc_when_Interceptor.attach.onEnter.md 

// 日志量高达3千万行。 疑似特别长的有 pit_irq_timer 、 generate_memory_topology ， 尝试跳过
  // 模块g_appName 中通常有函数被关注
  if(moduleName==_g_appName   ){
    // 'if ... return' 只关注给定条件, 不需要 全局条件 'return ...'   
    if  (
      //跳过:
      [
//跳过clang-var的c运行时 runtime_c__vars_fn
      "_init_varLs_inFn__RtC00", "createVar__RtC00", "destroyVarLs_inFn__RtC00",
//跳过clang-var的c++运行时 runtime_cpp__vars_fn
      // "_init_varLs_inFn__RtCxx", "createVar__RtCxx", "destroyVarLs_inFn__RtCxx", 
      //执行命令  objdump --syms  /server_root/fridaAnlzAp/clang-var/build/runtime_cpp__vars_fn/libclangPlgVar_runtime_cxx.a
      //发现 这些原始c++函数名 对应的abi函数名如下
      "_Z23_init_varLs_inFn__RtCxxNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEES4_ii", "_Z16createVar__RtCxxP11__VarDeclLsNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEEi", "_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLs",
//跳过clang-var的运行时基础 runtime_c__TmPnt_ThreadLocal
      "TL_TmPnt__update", "TL_TmPnt__get", "TL_TmPnt__printPtr",
    ].includes(fnSym.name) || 
//跳过qemu的巨量调用函数们:
//  frida_js运行qemu, ..., 直到 analyze_by_graph,  analyze_by_graph能提供调用次数
      fnSym.name == "pit_irq_timer" ||
      fnSym.name == "generate_memory_topology"||
      fnSym.name == "ffi_call" ||
//analyze_by_graph 打印大于1万次调用的函数们（方便返工修改frida_js以跳过大量调用函数）
      ["symcmp64",
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
      
    ].includes(fnSym.name) || 
      false
    )  {
      return false;
    }
  }

  if(moduleName=="libffi.so.8"){
    // 'if ... return' 只关注给定条件, 不需要 全局条件 'return ...'   
    if (
      //跳过:
      fnSym.name == "ffi_call"
    ){
      return false;
    }
  }

/**已确认 结束时frida出现'Process terminated' 对应的进程qphotorec有正常退出码0
https://gitee.com/repok/dwmkerr--linux-kernel-module/blob/e36a16925cd60c6e4b3487d254bfe7fa5b150f75/greeter/run.sh
*/
  //除上述特定关注外:
  
  //关注包含模块的所有函数
  if(_modules_include.includes(moduleName)){
    //  全局条件 'return ...'   , 不需要 'if ... return' 只关注给定条件
    return true;
  }
  //忽略排除模块的所有函数
  if(_modules_exclude.includes(moduleName)){
    //  全局条件 'return ...'   , 不需要 'if ... return' 只关注给定条件
    return false;
  }

  //其他情况 跳过
  return false;
}