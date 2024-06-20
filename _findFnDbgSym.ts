// [依赖] : 无
// [术语] : _g_x 见 readme.md

//填充函数符号表格
function findFnDbgSym(fnAdr:NativePointer,  _g_FnSymTab:Map<FnAdrHex,DebugSymbol>):DebugSymbol {
  // 相同内容的NativePointer可以是不同的对象，因为不能作为Map的key，必须用该NativePointer对应的字符串作为Map的key
  const fnAdrHex:FnAdrHex=adrToHex(fnAdr);
  let fnSym:DebugSymbol|undefined=_g_FnSymTab.get(fnAdrHex);
      if(fnSym!=null && fnSym!=undefined){ // !isNil(fnSym)
        // console.log(`##从缓存获得调试信息，${fnAdr}`);
        return fnSym;
      }

        //函数地址k的详情
        fnSym=DebugSymbol.fromAddress(fnAdr);

        // const modNm:string|null=fnSym.moduleName;
        // const fileNm:string|null=fnSym.fileName;

        //打印函数地址k
        console.log(`##只有首次查调试信息文件，${JSON.stringify(fnSym)}`);

        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        _g_FnSymTab.set(fnAdrHex, fnSym);

        return fnSym

}