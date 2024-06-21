// [依赖] : 无

/**clangVar插件c语言runtime中destroy函数输出参数们
destroy函数签名
  /fridaAnlzAp/clang-var/runtime_cpp__vars_fn/include/runtime_cpp__vars_fn.h
  void destroyVarLs_inFn__RtCxx(_VarDeclLs * _vdLs, std::string * jsonTxtOut_)
 */
// 
class C00DestroyFnOut {
  //进程_线程　下的　时刻值
  jsonTxtOutLimit:number
  //日志id
  jsonTxtOut:NativePointer
  //当前进程id
  jsonTxtOutLen:number
  constructor (jsonTxtOutLimit:number, jsonTxtOut:NativePointer,jsonTxtOutLen:number) {
    this.jsonTxtOutLimit=jsonTxtOutLimit
    this.jsonTxtOut = jsonTxtOut
    this.jsonTxtOutLen=jsonTxtOutLen
  }

  toJson(){
    return JSON.stringify(this)  
  }
}

//由于frida难以直接构造std::string，因此c++ destroy函数出参量可能也要改为char*, 参照c语言destroy函数
/**clangVar插件cxx语言runtime中destroy函数输出参数们
destroy函数签名
  /fridaAnlzAp/clang-var/runtime_c__vars_fn/include/runtime_c__vars_fn.h
  void destroyVarLs_inFn__RtC00(_VarDeclLs *_vdLs, int jsonTxtOutLimit, char* jsonTxtOut_, int* jsonTxtOutLen_)
 */
// class CxxDestroyFnOut {
//   //进程_线程　下的　时刻值
//   jsonTxtOutLimit:number
//   //日志id
//   jsonTxtOut:NativePointer
//   //当前进程id
//   jsonTxtOutLen:number
//   constructor (jsonTxtOutLimit:number, jsonTxtOut:NativePointer,jsonTxtOutLen:number) {
//     this.jsonTxtOutLimit=jsonTxtOutLimit
//     this.jsonTxtOut = jsonTxtOut
//     this.jsonTxtOutLen=jsonTxtOutLen
//   }

//   toJson(){
//     return JSON.stringify(this)  
//   }
// }
