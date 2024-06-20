// [依赖] : _TimePoint.ts/MG_TmPntVal


//方向枚举: 函数进入 或 函数离开
enum Direct{
  // 函数进入
  EnterFn = 1,
  // 函数离开
  LeaveFn = 2,
}

//函数调用描述(函数调用日志)
class FnLog {
  //进程_线程　下的　时刻值
  tmPnt:MG_TmPntVal
  //日志id
  logId:number
  //当前进程id
  processId:number
  //当前线程id
  curThreadId:ThreadId
  //方向: 函数进入 或 函数离开
  direct:Direct;
  //函数地址
  fnAdr:NativePointer;
  //针对此次函数调用的唯一编号
  fnCallId:number;
  //函数符号
  fnSym:DebugSymbol|undefined;
  modueBase:NativePointer|null;
  constructor (tmPntVal:MG_TmPntVal, logId:number,processId:number,curThreadId:ThreadId, direct:Direct, fnAdr:NativePointer, fnCallId: number,fnSym:DebugSymbol|undefined) {
    this.tmPnt=tmPntVal
    this.logId = logId
    this.processId=processId
    this.curThreadId = curThreadId
    this.direct = direct;
    this.fnAdr = fnAdr;
    this.fnCallId = fnCallId;
    this.fnSym = fnSym;
    //获取模块基地址
    if ( (fnSym!=undefined && fnSym!=null ) 
    && ( fnSym.moduleName!=undefined && fnSym.moduleName!=null ) 
  ){
      const md:Module=Process.getModuleByName(fnSym.moduleName)
      this.modueBase=md.base;
    }else{
      this.modueBase=null;
    }
  }

  toJson(){
    return JSON.stringify(this)  
  }
}


