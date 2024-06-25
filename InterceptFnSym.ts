////MyTsBegin

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


const NULL_num=NULL.toInt32();

// 以命令MyTsCmd从配置文件config.json读取应用程序名 填充到下一行
//MyTsCmd//_replaceSubStrInNextLine('{}' ,  readTxtFile("./config.json") , curNextLn )
const g_cfg:{[key:string]:string} =  {}; //配置文件文本
//应用程序全路径
const g_appPath: string = g_cfg["appPath"];
//应用程序参数列表作为字符串
const g_appArgLsAsTxt: string = g_cfg["appArgLsAsTxt"];
//应用程序名字
const g_appName: string =baseNameOfFilePath(g_appPath);

// 以命令MyTsCmd导入文件 _DateTime_util.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_DateTime_util.ts" , curNextLn)
//脚本启动时的绝对毫秒数
const g_tsBeginDtMs:number=get_now_ms()

// 以命令MyTsCmd导入文件 _logWriteLn.ts
//MyTsCmd//_replaceCurLineByTsFileContent("./_logWriteLn.ts" , curNextLn)

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

const C_Lang__sizeof_int=4; // sizeof(int)
//  调整出参jsonTxtOut_ 长度超过 sleuthkit运行出现的最大长度 51719 
const C_jsonTxtOut_Limit:number = 1024*60;

// 导入 ' _FnLog.ts 函数调用描述(函数调用日志) '
//MyTsCmd//_replaceCurLineByTsFileContent("./_FnLog.ts" , curNextLn)

// 导入 ' _adrEq.ts 判断两个函数地址值 是否相同 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_adrEq.ts" , curNextLn)

// 导入 ' _FnOutArg_DestroyRtC00.ts  clang-var插件中runtime c00中destroy函数json串出参 操纵 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_FnOutArg_DestroyRtC00.ts" , curNextLn)

// 导入 ' _nativeFn__fridaHelper__cxxFuncWrap__std_string.ts    frida 通过本地助手函数 间接调用 c++ std::string 的new 、 delete   '
//MyTsCmd//_replaceCurLineByTsFileContent("./_nativeFn__fridaHelper__cxxFuncWrap__std_string.ts" , curNextLn)

// 导入 ' _FnOutArg_DestroyRtCxx.ts  修改函数的类型为std::string的出参   '
//MyTsCmd//_replaceCurLineByTsFileContent("./_FnOutArg_DestroyRtCxx.ts" , curNextLn)

//日志开头标记
//  以换行开头的理由是，避开应用程序日志中不换行的日志 造成的干扰。
const LogLinePrefix:string="\n__@__@";

/** onEnter ， 函数进入
 */
function OnFnEnterBusz(thiz:InvocationContext,  args:InvocationArguments){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const tmPntVal:MG_TmPntVal=nextTmPnt(g_TmPntTb,Process.id,curThreadId)
  var fnAdr=thiz.context.pc;
  var fnSym :DebugSymbol|undefined= findFnDbgSym(thiz.context.pc,g_FnSymTab)
  thiz.fnEnterLog=new FnLog(tmPntVal,++gLogId,Process.id,curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
  logWriteLn(`${LogLinePrefix}${thiz.fnEnterLog.toJson()}`)


// 函数进入时, 调用本地函数 'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)', 用以表达 此线程的此次函数调用的 _vdLs 和 时刻点 tmPntVal 一 一 对 应
  call_nativeFn__TL_TmPnt__update(curThreadId,tmPntVal)

  //clang-var插件中runtime c00中destroy函数json串出参 操纵.  给出参赋以全局内存空间
  if(fnSym && fnSym.name=="destroyVarLs_inFn__RtC00"){
    logWriteLn(`[frida_js, OnFnEnterBusz] before Fn05OutArg Enter`); 
    const g_charArr__jsonTxtOut_:NativePointer=Memory.alloc(C_jsonTxtOut_Limit-1)
    const g_intPtr__jTxtOLenOut_:NativePointer=Memory.alloc(C_Lang__sizeof_int);
    thiz.fnOutArg_DestroyRtC00=FnOutArg_DestroyRtC00.Enter(args,C_jsonTxtOut_Limit,g_charArr__jsonTxtOut_,g_intPtr__jTxtOLenOut_);
    logWriteLn(`[frida_js, OnFnEnterBusz] after Fn05OutArg Enter`); 
    //走到这里了
  }

  // 对 函数 DestroyRtCxx 做特定处理
  if(fnSym && fnSym.name==mg_fnName__DestroyRtCxx){
    logWriteLn(`[frida_js, OnFnEnterBusz] before FnOutArg_DestroyRtCxx Enter`); 
    thiz.cxxFnOutArg_stdString__DestroyRtCxx=FnOutArg_DestroyRtCxx.Enter(args);
    logWriteLn(`[frida_js, OnFnEnterBusz] after FnOutArg_DestroyRtCxx Enter`); 
  }
}

/**  OnLeave ，函数离开
 */
function OnFnLeaveBusz(thiz:InvocationContext,  retval:any ){
  const curThreadId:ThreadId=Process.getCurrentThreadId()
  const tmPnt:MG_TmPntVal=nextTmPnt(g_TmPntTb,Process.id,curThreadId)
  var fnAdr=thiz.context.pc;
  const fnEnterLog:FnLog=thiz.fnEnterLog;
  const fnLeaveLog:FnLog=new FnLog(tmPnt,++gLogId,Process.id,curThreadId, Direct.LeaveFn, fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
  if(!adrEq(fnAdr,thiz.fnEnterLog.fnAdr)){
    logWriteLn(`##断言失败，onEnter、onLeave的函数地址居然不同？ 立即退出进程，排查问题. OnLeave.fnAdr=【${fnAdr}】, thiz.fnEnterLog.fnAdr=【${thiz.fnEnterLog.fnAdr}】, thiz.fnEnterLog=【${thiz.fnEnterLog.toJson()}】,fnLeaveLog=【${fnLeaveLog.toJson()}】`)
  }
  logWriteLn(`${LogLinePrefix}${fnLeaveLog.toJson()}`)

  //clang-var插件中runtime c00中destroy函数json串出参 操纵.  拿出参内容
  if(thiz && thiz.fnEnterLog && thiz.fnEnterLog.fnSym && thiz.fnEnterLog.fnSym.name=="destroyVarLs_inFn__RtC00"){
    logWriteLn(`[frida_js, OnFnLeaveBusz] before FnOutArg_DestroyRtC00 Leave`); 
    thiz.fnOutArg_DestroyRtC00.Leave();
    logWriteLn(`[frida_js, OnFnLeaveBusz] after FnOutArg_DestroyRtC00 Leave`); 
  }

  //对 函数 DestroyRtCxx 做特定处理
  if(thiz && thiz.fnEnterLog && thiz.fnEnterLog.fnSym && thiz.fnEnterLog.fnSym.name==mg_fnName__DestroyRtCxx      && thiz  && thiz.cxxFnOutArg_stdString__DestroyRtCxx){
    logWriteLn(`[frida_js, OnFnLeaveBusz] before FnOutArg_DestroyRtCxx Leave`); 
    thiz.cxxFnOutArg_stdString__DestroyRtCxx.Leave();
    logWriteLn(`[frida_js, OnFnLeaveBusz] after FnOutArg_DestroyRtCxx Leave`); 
  }
}

// '包装' 使用了  '实现' 和 '配置'
// '配置' 使用了  '实现'
// 导入 '模块的函数名过滤器 实现 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_focus_fnAdr/_impl.ts" , curNextLn)
// 导入 '模块的函数名过滤器 配置 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_focus_fnAdr/_config.ts" , curNextLn)
// 导入 '模块的函数名过滤器 包装 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_focus_fnAdr/_wrap.ts" , curNextLn)

function _main_(){
  // 主模块 jdk/bin/java  中 没有 使用 runtimeC00 、 runtimeCxx ，  只有 依赖模块 使用了 ，因此 要先强制加载依赖模块, 依赖模块们 参考 https://prgrmz07.coding.net/p/app/d/jdk/git/tree/brch_jdk-24%2B0__cmdWrapBuildByClangVar_2024_0625_1358/_build_/find__clangVar_runtime_fn.out.txt
  Module.load("/app2/jdk-jdk-24-0/build_home/jdk/lib/libjli.so");
  Module.load("/app2/jdk-jdk-24-0/build_home/jdk/lib/server/libjvm.so");
  Module.load("/app2/jdk-jdk-24-0/build_home/jdk/lib/libjimage.so");
  Module.load("/app2/jdk-jdk-24-0/build_home/jdk/lib/libjava.so");
  Module.load("/app2/jdk-jdk-24-0/build_home/jdk/lib/libjsvml.so");
  Module.load("/app2/jdk-jdk-24-0/build_home/jdk/lib/libnio.so");
  Module.load("/app2/jdk-jdk-24-0/build_home/jdk/lib/libnet.so");

  // 获取 本地函数   'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)'
  get_nativeFn__clgVarRt__TL_TmPnt__update();
  // 获取 本地函数 fridaHelper__cxxFuncWrap__std_string_new
  get__fridaHelper__cxxFuncWrap__std_string_new();
  //获取 本地函数 fridaHelper__cxxFuncWrap__std_string_delete
  get__fridaHelper__cxxFuncWrap__std_string_delete();
  //获取 本地函数 get__fridaHelper__cxxFuncWrap__std_string_size
  get__fridaHelper__cxxFuncWrap__std_string_size();
  //获取 本地函数 get__fridaHelper__cxxFuncWrap__std_string_cstr
  get__fridaHelper__cxxFuncWrap__std_string_cstr();

  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    /*修复 在拦截libc.so.6 pthread_getschedparam时抛出异常说进程已终止并停在frida终端 ： 不拦截 比如libc.so、frida-agent.so等底层*/
    if(!focus_fnAdr(fnAdr)){
      continue;
    }
    const fnSym=DebugSymbol.fromAddress(fnAdr);
    //进度百分数
    const progress_percent:string=(100*k/fnAdrCnt).toFixed(2);
    logWriteLn(`##${nowTxt()}; [关注函数]; fnSym.json= ${JSON.stringify(fnSym)}`)


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
// 导入 ' _cMainFn_addArgLs_atBoot_attach.ts。 在启动时, 附加到C语言main函数, 添加参数列表 '
//MyTsCmd//_replaceCurLineByTsFileContent("./_cMainFn_addArgLs_atBoot_attach.ts" , curNextLn)

/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决
frida 运行报超时错误 "Failed to load script: the connection is closed" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
function _entry() {
  const mnArgTxt:string=`${g_appPath} ${g_appArgLsAsTxt}`;
  // 若添加参数列表失败，则 退出[即不执行业务代码]
  if(!cMainFn_addArgLs_atBoot_attach(mnArgTxt)){
    logWriteLn("[失败] 在启动时, 附加到C语言main函数, 添加参数列表 [因这失败而不执行业务代码]");
  }
  //否则[即添加参数列表正常] ，则进入业务主体代码
  else{
  //业务代码
  _main_();
  }

  logWriteLn("定时器函数退出");
}
setTimeout(_entry, 0);
