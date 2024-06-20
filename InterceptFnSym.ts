////frida-trace初始化js

// ［术语］　g_TmPntTb==gTmPnt_Table==gTmPnt表格==tmPnt计数器集合
// ［简写］ AbsThrdId==AbsoluteThreadId==绝对线程id==进程id_线程id , g_TmPntTb == globalTimePointTable == 全局时刻表格
//  [备注] 
//       frida_js 的  fnCallId计数器为gFnCallId   ， fnCallId进程内唯一, 具体如下
//           1. 在 单应用进程 内 fnCallId唯一且递增  
//           2. 当 单应用进程 内 各线程 分配到的fnCallId 放到一起 是 从1到N的连续自然数 
//           3. 当 单应用进程 内 的某个线程 分配到的fnCallId 一般是 断裂的、非连续、但递增的自然数
//       frida_js 的  tmPnt计数器为g_TmPntTb   ， tmPnt线程内唯一, 具体如下
//           1. 在 单应用进程 内 的线程k 其tmPnt计数器 为 g_TmPntTb[k]
//           2. 在 单应用进程 内 的某个线程 内 tmPnt 唯一且递增
//           3. 在 单应用进程 内 ，线程1的 tmPnt 为 从1到N的连续自然数  ，线程2的 tmPnt 也为 从1到N的连续自然数 ，但是这两不同线程的 tmPnt 不表达任何关系

// 导入 _msic_util.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_msic_util.ts" , curNextLn)

// 导入 _TimePoint.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_TimePoint.ts" , curNextLn)

// 导入 _findFnDbgSym.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_findFnDbgSym.ts" , curNextLn)

// 导入 _nativeFn__TL_TmPnt__update.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_nativeFn__TL_TmPnt__update.ts" , curNextLn)

//函数符号表格 全局变量
const g_FnSymTab:Map<FnAdrHex,DebugSymbol> = new Map();
//函数调用id
let gFnCallId:number = 0;
//日志id
let gLogId:number = 0;
//时刻表格 全局变量
//  进程_线程　对应的　最新时刻值
const g_TmPntTb:Map<MG_AbsThrdId,MG_TimePoint> = new Map();

// 导入 ' _FnLog.ts 函数调用描述(函数调用日志) '
//MyTsCmd//_replaceCurLineByTsFileContent("./_FnLog.ts" , curNextLn)

// 导入 ' _adrEq.ts 判断两个函数地址值 是否相同 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_adrEq.ts" , curNextLn)

//日志开头标记
//  以换行开头的理由是，避开应用程序日志中不换行的日志 造成的干扰。
const LogLinePrefix:string="\n__@__@";

/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz:InvocationContext,  args:InvocationArguments){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const tmPntVal:MG_TmPntVal=nextTmPnt(Process.id,curThreadId)
  var fnAdr=thiz.context.pc;
  var fnSym :DebugSymbol|undefined= findFnDbgSym(thiz.context.pc,g_FnSymTab)
  thiz.fnEnterLog=new FnLog(tmPntVal,++gLogId,Process.id,curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
  console.log(`${LogLinePrefix}${thiz.fnEnterLog.toJson()}`)


// 函数进入时, 调用本地函数 'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)', 用以表达 此线程的此次函数调用的 _vdLs 和 时刻点 tmPntVal 一 一 对 应
  call_nativeFn__TL_TmPnt__update(curThreadId,tmPntVal)

}

/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz:InvocationContext,  retval:any ){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const tmPnt:MG_TmPntVal=nextTmPnt(Process.id,curThreadId)
  var fnAdr=thiz.context.pc;
  const fnEnterLog:FnLog=thiz.fnEnterLog;
  const fnLeaveLog:FnLog=new FnLog(tmPnt,++gLogId,Process.id,curThreadId, Direct.LeaveFn, fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
  if(!adrEq(fnAdr,thiz.fnEnterLog.fnAdr)){
    console.log(`##断言失败，onEnter、onLeave的函数地址居然不同？ 立即退出进程，排查问题. OnLeave.fnAdr=【${fnAdr}】, thiz.fnEnterLog.fnAdr=【${thiz.fnEnterLog.fnAdr}】, thiz.fnEnterLog=【${thiz.fnEnterLog.toJson()}】,fnLeaveLog=【${fnLeaveLog.toJson()}】`)
  }
  console.log(`${LogLinePrefix}${fnLeaveLog.toJson()}`)
}

function focus_fnAdr(fnAdr:NativePointer){
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

  if(moduleName==g_appName   ){
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
  if(modules_include.includes(moduleName)){
    //  全局条件 'return ...'   , 不需要 'if ... return' 只关注给定条件
    return true;
  }
  //忽略排除模块的所有函数
  if(modules_exclude.includes(moduleName)){
    //  全局条件 'return ...'   , 不需要 'if ... return' 只关注给定条件
    return false;
  }

  //其他情况 跳过
  return false;
}

function _main_(){
  // 获取 本地函数   'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)'
  get_nativeFn__clgVarRt__TL_TmPnt__update();

  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    /*修复 在拦截libc.so.6 pthread_getschedparam时抛出异常说进程已终止并停在frida终端 ： 不拦截 比如libc.so、frida-agent.so等底层*/
    if(!focus_fnAdr(fnAdr)){
      continue;
    }
    // const fnSym=DebugSymbol.fromAddress(fnAdr);
    //进度百分数
    const progress_percent:string=(100*k/fnAdrCnt).toFixed(2);
    console.log(`##${nowTxt()};Interceptor.attach fnAdr=${fnAdr};  进度【${progress_percent}%,${k}~${fnAdrCnt} 】`)


    Interceptor.attach(fnAdr,{
      onEnter:function  (this: InvocationContext, args: InvocationArguments) {
        OnFnEnterBusz(this,args)
      },
      onLeave:function (this: InvocationContext, retval: InvocationReturnValue) {
        OnFnLeaveBusz(this,retval)
      }

    })
  }

}

/** 在启动时, 附加到C语言main函数, 添加参数列表
 * firda拦截应用的main函数并添加参数，注意只有类c编译器产生的应用才有main函数
 * 
 * 添加参数 /app/qemu/build-v8.2.2/qemu-system-x86_64 -nographic  -append "console=ttyS0"  -kernel  /bal/linux-stable/arch/x86/boot/bzImage -initrd /bal/bldLinux4RunOnBochs/initramfs-busybox-i686.cpio.tar.gz 
 * 参考 :  https://stackoverflow.com/questions/72871352/frida-spawn-a-windows-linux-process-with-command-line-arguments/72880066#72880066
 * 
 readelf --symbols /app/qemu/build/qemu-system-x86_64 | egrep "main$"
 37431: 00000000003153f0    23 FUNC    GLOBAL DEFAULT   16 main

 这种就是有main函数的

 */
function cMainFn_addArgLs_atBoot_attach(argLsAsTxt:string):boolean{
  //若参数列表文本为空,则返回失败
  if (argLsAsTxt == null || argLsAsTxt== undefined || argLsAsTxt.length==0){
    console.log("##main参数为空")
    return false;
  }

  const mnFnPtr:NativePointer = DebugSymbol.fromName("main").address;
  //若无名为main的函数,则返回失败
  if (mnFnPtr==null || mnFnPtr==undefined){
    console.log("##无main函数,无法通过拦截main函数来添加参数,可能不是类c编译器产生的应用")
    return false;
  }
  console.log(`##收到main函数参数mnArgTxt=${argLsAsTxt}`)

  //若参数列表元素个数小于0,则返回失败
  const mnArgStrLs_raw:string[]=argLsAsTxt.split(" ")
  if(mnArgStrLs_raw.length<=0){
    return false;
  }

  //若参数列表中非空串的元素个数小于0,则返回失败
  const mnArgStrLs:string[]=mnArgStrLs_raw.filter(elm=>elm!="")
  if(mnArgStrLs.length<=0){
    return false;
  }

  //执行附加
  //  被附加的代码 此时不会被执行, 
  //  被附加的代码 在等到刚进入main函数被调用时  才会被执行 
  Interceptor.attach(mnFnPtr, {
      onEnter:function  (this: InvocationContext, args: InvocationArguments) {
        console.log(`##进入main函数`)
        // main(int argc, char** argv): args[0] == int argc, args[1] == wchar *argv[]
        const mnArgMemLs:NativePointer[]=mnArgStrLs.map(mnArgStr=>Memory.allocUtf8String(mnArgStr))
        const mnArgVect:NativePointer = Memory.alloc(mnArgMemLs.length * Process.pointerSize)
        //参数列表作为this的字段，防止被垃圾回收
        this.mnArgVect=mnArgVect;

          for (let [k,argK] of  mnArgMemLs.entries()){
            //每个参数都作为this的字段，防止被垃圾回收
            this[`mnArgMem${k}`]=argK

            mnArgVect.add(k*Process.pointerSize).writePointer(argK);
          }

  
          
          // 覆盖 main(int argc, char** argv) 中的argc 、 argv
          args[0] = ptr(mnArgMemLs.length);
          args[1] = mnArgVect;
          
      }
  });

  //若到此时无错误,则默认成功
  return true;
}


//应用程序全路径
const g_appFullPath: string ='/app/qemu/build-v8.2.2/qemu-system-x86_64';
//应用程序名字
const g_appName: string =baseNameOfFilePath(g_appFullPath);

/**
ldd /app/qemu/build-v8.2.2/qemu-system-x86_64
        linux-vdso.so.1 (0x00007ffff7fc1000)
        libpixman-1.so.0 => /lib/x86_64-linux-gnu/libpixman-1.so.0 (0x00007ffff67a2000)
        libz.so.1 => /lib/x86_64-linux-gnu/libz.so.1 (0x00007ffff6786000)
        libgio-2.0.so.0 => /lib/x86_64-linux-gnu/libgio-2.0.so.0 (0x00007ffff65ad000)
        libgobject-2.0.so.0 => /lib/x86_64-linux-gnu/libgobject-2.0.so.0 (0x00007ffff654d000)
        libglib-2.0.so.0 => /lib/x86_64-linux-gnu/libglib-2.0.so.0 (0x00007ffff6413000)
        libgmodule-2.0.so.0 => /lib/x86_64-linux-gnu/libgmodule-2.0.so.0 (0x00007ffff640a000)
        libm.so.6 => /lib/x86_64-linux-gnu/libm.so.6 (0x00007ffff6323000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ffff60fa000)
        /lib64/ld-linux-x86-64.so.2 (0x00007ffff7fc3000)
        libmount.so.1 => /lib/x86_64-linux-gnu/libmount.so.1 (0x00007ffff60b6000)
        libselinux.so.1 => /lib/x86_64-linux-gnu/libselinux.so.1 (0x00007ffff608a000)
        libffi.so.8 => /lib/x86_64-linux-gnu/libffi.so.8 (0x00007ffff607d000)
        libpcre.so.3 => /lib/x86_64-linux-gnu/libpcre.so.3 (0x00007ffff6005000)
        libblkid.so.1 => /lib/x86_64-linux-gnu/libblkid.so.1 (0x00007ffff5fce000)
        libpcre2-8.so.0 => /lib/x86_64-linux-gnu/libpcre2-8.so.0 (0x00007ffff5f37000)
*/

//关注模块
const modules_include=[
  g_appName,
];
// "libstdc++.so.6.0.30", //?如果libstdc++的代码 穿插在业务代码中， 若忽略之 则调用链条断裂
// ldd /app/qemu/build-v8.2.2/qemu-system-x86_64 | awk '{print " \""$1"\","}'
//排除模块
const modules_exclude:string[]=[
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

/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决
frida 运行报超时错误 "Failed to load script: the connection is closed" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
  //qemu启动启用了PVH的（linux原始内核）vmlinux, 参考:  http://giteaz:3000/frida_analyze_app_src/app_env/src/tag/tag_release__qemu_v8.2.2_build/busz/02_qemu_boot_vmlinux.sh
  const mnArgTxt:string='/app/qemu/build-v8.2.2/qemu-system-x86_64 -nographic  -append "console=ttyS0"  -kernel  /app/linux/vmlinux -initrd /app/linux/initRamFsHome/initramfs-busybox-i686.cpio.tar.gz';
  // -d exec -D qemu.log  
  //业务代码
  cMainFn_addArgLs_atBoot_attach(mnArgTxt)
  _main_()

}, 0);
