//【术语】 CaIdLs == CallIdList

////frida-trace初始化js
//函数符号表格 全局变量
const gFnSymTab:Map<string,DebugSymbol> = new Map();

//调用id分配器
let gFnCallId:number = 0;

//到目前为止，函数地址的调用id列表。  
//  主要用于另一个函数f知道其父亲函数地址pa, 从而 fnAdr2CaIdLs[pa][0] 即为函数f的本次父调用id
const fnAdr2CaIdLs:Map<string,number[]> = new Map();

function fnAdrAddCaId(fnAdr:NativePointer,fnCaId:number){

}
//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer):DebugSymbol|undefined{
  // 相同内容的NativePointer可以是不同的对象，因为不能作为Map的key，必须用该NativePointer对应的字符串作为Map的key
  const fnAdrHex:string=fnAdr.toString();
      if(gFnSymTab.has(fnAdrHex)){
        console.log(`##从缓存获得调试信息，${fnAdr}`);
        return gFnSymTab.get(fnAdrHex);
      }

        //函数地址k的详情
        const fnSym:DebugSymbol=DebugSymbol.fromAddress(fnAdr);

        const modNm:string|null=fnSym.moduleName;
        const fileNm:string|null=fnSym.fileName;

        //打印函数地址k
        console.log(`##只有首次查调试信息文件，${JSON.stringify(fnSym)}`);

        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        gFnSymTab.set(fnAdrHex, fnSym);

        return fnSym

}

//方向枚举: 函数进入 或 函数离开
enum Direct{
  // 函数进入
  EnterFn = 1,
  // 函数离开
  LeaveFn = 2,
}

class FnLog {
  //方向: 函数进入 或 函数离开
  direct:Direct;
  //函数地址
  fnAdr:NativePointer;
  //针对此次函数调用的唯一编号
  fnCallId:number;
  //函数符号
  fnSym:DebugSymbol|undefined;
  constructor (direct:Direct, fnAdr:NativePointer, fnCallId: number,fnSym:DebugSymbol|undefined) {
    this.direct = direct;
    this.fnAdr = fnAdr;
    this.fnCallId = fnCallId;
    this.fnSym = fnSym;
  }

  toJson(){
    return JSON.stringify(this)  
  }
}

/** 被frida-trace工具生成的.js函数中的onEnter调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */

function fridaTraceJsOnEnterBusz(thiz:InvocationContext, log:any, args:any[], state:any){
  const fnCallId:number = ++gFnCallId;
  
  var fnAdr=thiz.context.pc;
  
  //记录 该函数地址的本次调用id
  fnAdrAddCaId(fnAdr,fnCallId);

  var fnSym :DebugSymbol|undefined= findFnDbgSym(thiz.context.pc)
  thiz.fnEnterLog=new FnLog(Direct.EnterFn, fnAdr, fnCallId, fnSym);
  log(thiz.fnEnterLog.toJson())

}

/** 被frida-trace工具生成的.js函数中的OnLeave调用
 * 假设 有命令 'frida-trace --output fr.log', 则 log('xxx') 是 向 fr.log 中写入 'xxx'
 *   而 console.log 则并不写入到 fr.log
 */
function fridaTraceJsOnLeaveBusz(thiz:InvocationContext, log:any, retval:any, state:any){
  const fnEnterLog:FnLog=thiz.fnEnterLog;
  const fnLeaveLog:FnLog=new FnLog(Direct.LeaveFn, fnEnterLog.fnAdr, fnEnterLog.fnCallId, fnEnterLog.fnSym);
  log(fnLeaveLog.toJson())
}
