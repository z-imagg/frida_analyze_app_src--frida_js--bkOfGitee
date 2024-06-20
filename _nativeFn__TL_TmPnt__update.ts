
// [依赖] : 无
// [描述] 描述 本地函数 TL_TmPnt__update
// [业务描述]  
//    函数进入时, 调用本地函数 'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)', 用以表达 此线程的此次函数调用的 _vdLs 和 时刻点 tmPntVal 一 一 对 应

/**  函数描述

  该函数签名:
  /fridaAnlzAp/clang-var/runtime_c__TmPnt_ThreadLocal/include/rntm_c__TmPnt_ThrLcl.h
  void TL_TmPnt__update(int _TmPnt_new);

  调用该函数 的 伪代码：
  TL_TmPnt__update(tmPntVal)
  */

// 持有本地函数 'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)'
let g_nativeFn__clgVarRt__TL_TmPnt__update:NativeFunction<void,[ThreadId,MG_TmPntVal]>  |null;  
// ThreadId == number , MG_TmPntVal == number 

// 调用本地函数 'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)'
function call_nativeFn__TL_TmPnt__update(curThreadId:ThreadId,tmPntVal:MG_TmPntVal){

  //调用 clang-var运行时基础 中函数 TL_TmPnt__update(tmPntVal)
  if(g_nativeFn__clgVarRt__TL_TmPnt__update){
    // const ret= //无返回值
    g_nativeFn__clgVarRt__TL_TmPnt__update(curThreadId,tmPntVal);
  }

}


// 获取 本地函数   'clang-var运行时基础 中的 TL_TmPnt__update(tmPntVal)'
function get_nativeFn__clgVarRt__TL_TmPnt__update():void{
  const fnAdr__clgVarRt__TL_TmPnt__update:NativePointer = DebugSymbol.fromName("TL_TmPnt__update").address;
  g_nativeFn__clgVarRt__TL_TmPnt__update=  new NativeFunction(fnAdr__clgVarRt__TL_TmPnt__update, 'void',['int','int']);
}
