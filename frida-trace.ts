
//函数符号表格 全局变量
const gFnSymTab:Map<NativePointer,DebugSymbol> = new Map();
//填充函数符号表格
function createFnSymTab(){
    //打印模块列表
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))

    // const Mod=Process.findModuleByName("libtorch.so.1");
    //获取调试信息中全部函数地址
    const fnLsInDbgSym:NativePointer[]=DebugSymbol.findFunctionsMatching("*")
    console.log(`调试信心中函数个数=${fnLsInDbgSym.length}`)
    
    let k:number = 0;
    //遍历调试信息中的全部函数
    for (let fnAdrK of fnLsInDbgSym) {
        //想要通过日志打印 人工知道 哪个函数的 DebugSymbol.fromAddress 很卡？
        // console.log(`k=${k++},fnAdr=${fnAdrK}`);

        //函数地址k的详情
        const fnSymK:DebugSymbol=DebugSymbol.fromAddress(fnAdrK);

        const modNm:string|null=fnSymK.moduleName;
        const fileNm:string|null=fnSymK.fileName;
        // 
        if (
            // 忽略 空文件名, 空文件名的是其他用途的符号？
            fileNm == null || fileNm == undefined || fileNm == "" ||
            // 忽略/usr/include/c++/等下的相关源文件名
            fileNm?.startsWith("/usr/include/c++") ||
            fileNm?.startsWith("/usr/include/x86_64-linux-gnu/c++")
        ){
            continue;
        }

        //打印函数地址k
        console.log(JSON.stringify(fnSymK));

        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        gFnSymTab.set(fnAdrK, fnSymK);

        if(gFnSymTab.size % 1000 == 0 ){
            console.log(`函数表格尺寸:${gFnSymTab.size}`)
        }

      //为了尽快拿到结果，提前退出循环
      if(gFnSymTab.size > 1000 ){
        break;
      }

    }


}

//拦截 函数符号表格 中的 每个函数
function interceptFnLs(){
    const fnAdrLs=gFnSymTab.keys();
    for (let fnAdrK of fnAdrLs) {
        
        // https://frida.re/docs/javascript-api/#interceptor
        Interceptor.attach(fnAdrK, {
          onEnter: function (this,args) {
            // send(args);
        //    console.log('args:'+args);
            // console.log('Context information:');
            const fnSym=DebugSymbol.fromAddress(this.context.pc)
            console.log(`fnSym=${fnSym}`)
            console.log('Context  : ' + JSON.stringify(this.context));
            console.log('Return   : ' + this.returnAddress);
            console.log('ThreadId : ' + this.threadId);
            console.log('Depth    : ' + this.depth);
            console.log('Errornr  : ' + this.err);
          },
          onLeave(this,retval) {
            // Show argument 1 (buf), saved during onEnter.
            // const retvalInt32 = retval.toInt32();
            // console.log('retvalInt32   : ' + retvalInt32);
          }
        });
        }
}
/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
    //业务代码
    createFnSymTab()
    interceptFnLs()
  }, 0);


/**
调试信心中函数个数=289146
调试信息中的新模块，simple_nn.elf
调试信息中的新模块，linux-vdso.so.1
调试信息中的新模块，frida-agent-64.so
调试信息中的新模块，libopen-rte.so.40.30.2
调试信息中的新模块，libc.so.6
调试信息中的新模块，libudev.so.1.7.2
调试信息中的新模块，libmpi.so.40.30.2
调试信息中的新模块，libstdc++.so.6.0.30
调试信息中的新模块，libz.so.1.2.11
调试信息中的新模块，libopen-pal.so.40.30.2
调试信息中的新模块，libm.so.6
调试信息中的新模块，libcaffe2.so  #此模块中函数太多，很耗时，等不起
 */


