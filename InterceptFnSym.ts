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
  const tmPntVal:MG_TmPntVal=nextTmPnt(g_TmPntTb,Process.id,curThreadId)
  var fnAdr=thiz.context.pc;
  var fnSym :DebugSymbol|undefined= findFnDbgSym(thiz.context.pc,g_FnSymTab)
  thiz.fnEnterLog=new FnLog(tmPntVal,++gLogId,Process.id,curThreadId, Direct.EnterFn, fnAdr, ++gFnCallId, fnSym);
  logWriteLn(`${LogLinePrefix}${thiz.fnEnterLog.toJson()}`)


// 函数进入时, 调用本地函数 'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)', 用以表达 此线程的此次函数调用的 _vdLs 和 时刻点 tmPntVal 一 一 对 应
  call_nativeFn__TL_TmPnt__update(curThreadId,tmPntVal)

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
  // 获取 本地函数   'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)'
  get_nativeFn__clgVarRt__TL_TmPnt__update();

  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  const fnAdrCnt=fnAdrLs.length
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
    /*修复 在拦截libc.so.6 pthread_getschedparam时抛出异常说进程已终止并停在frida终端 ： 不拦截 比如libc.so、frida-agent.so等底层*/
    if(!focus_fnAdr(fnAdr,g_appName)){
      continue;
    }
    // const fnSym=DebugSymbol.fromAddress(fnAdr);
    //进度百分数
    const progress_percent:string=(100*k/fnAdrCnt).toFixed(2);
    logWriteLn(`##${nowTxt()};Interceptor.attach fnAdr=${fnAdr};  进度【${progress_percent}%,${k}~${fnAdrCnt} 】`)


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
