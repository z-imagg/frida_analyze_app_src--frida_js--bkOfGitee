////frida-trace初始化js

// ［术语］　

function _main_(){
  const fnAdrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*");
  const fnAdrCnt=fnAdrLs.length
  console.timeLog(`## fnAdrCnt=${fnAdrCnt}`)
  for (let [k,fnAdr] of  fnAdrLs.entries()){
    
  const fnSym=DebugSymbol.fromAddress(fnAdr);
  if (fnSym.moduleName && fnSym.moduleName=="ls" && fnSym.name=="main"){
  }
    // const fnSym=DebugSymbol.fromAddress(fnAdr);
    console.timeLog(`##Interceptor.attach ${fnAdr}`)


    Interceptor.attach(fnAdr,{
      onEnter:function  (this: InvocationContext, args: InvocationArguments) {
        console.timeLog(`onEnter${this.context.pc}`)
      },
      onLeave:function (this: InvocationContext, retval: InvocationReturnValue) {
        console.timeLog(`onLeave${this.context.pc}`)
      }

    })
  }

}


/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决
frida 运行报超时错误 "Failed to load script: the connection is closed" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
  //业务代码
  _main_()

}, 0);
