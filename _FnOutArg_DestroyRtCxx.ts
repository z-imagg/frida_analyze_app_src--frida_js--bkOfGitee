// [依赖] : _logFile.ts/logWriteLn
// [描述] : clang-var插件中runtime cxx中destroy函数json串出参 操纵

// const mg_abiName__DestroyRtCxx:string="_Z24destroyVarLs_inFn__RtCxxP11__VarDeclLsPNSt7__cxx1112basic_stringIcSt11char_traitsIcESaIcEEE";
const mg_fnName__DestroyRtCxx:string="destroyVarLs_inFn__RtCxx";

enum FnArgIdx_Fn06{
// cxxFunc06_outArgString 函数签名
//  /fridaAnlzAp/clang-var/runtime_cpp__vars_fn/include/runtime_cpp__vars_fn.h
// void destroyVarLs_inFn__RtCxx(_VarDeclLs * _vdLs, std::string * jsonTxtOut_)
    _vdLs=0,
    jsonTxtOut_=1,
    // arg2Name=2, //这一行是举例而已，此函数只有以上两个参数
}

//clang-var插件中runtime cxx中destroy函数json串出参 操纵.
class FnOutArg_DestroyRtCxx{

  //  /fridaAnlzAp/frida_js_demo/app.cpp / fridaHelper__cxxFuncWrap__std_string_cstr / _Err1 == 1
  static  stdStr_2_fridaBuf__Err1:number = 1;
  //  /fridaAnlzAp/frida_js_demo/app.cpp / fridaHelper__cxxFuncWrap__std_string_cstr / _OK == 0
  static  stdStr_2_fridaBuf__OK:number = 0;
  //  /fridaAnlzAp/frida_js_demo/app.cpp / fridaHelper__cxxFuncWrap__std_string_cstr / _stdStr_2_fridaBuf_gap == 11
  static   stdStr_2_fridaBuf_gap:number = 11;

  ptrCxxStdStr__jsonTxtOut_:NativePointer
    
  static Enter(
    args:InvocationArguments,
  ):FnOutArg_DestroyRtCxx|null{

  let  _ptrCxxStdStr__jsonTxtOut_:NativePointer;
    //调用本地函数 fridaHelper__cxxFuncWrap__std_string_new 
    _ptrCxxStdStr__jsonTxtOut_=nativeFn__fridaHelper__cxxFuncWrap__std_string_new( ) ;
    //等效c++语句为
    //std::string* _ptrCxxStdStr__jsonTxtOut_=new std::string()

    logWriteLn(`[frida_js CxxFnOutArg_DestroyRtCxx.Enter] _ptrCxxStdStr__jsonTxtOut_=[${_ptrCxxStdStr__jsonTxtOut_}]`); 
    
    if(_ptrCxxStdStr__jsonTxtOut_){
      return new FnOutArg_DestroyRtCxx(args,  _ptrCxxStdStr__jsonTxtOut_);
    }

  return null;

  }
    
//给出参赋以全局内存空间
  constructor(
    args:InvocationArguments,
    _ptrCxxStdStr__jsonTxtOut_:NativePointer
  ){

    // 不关注参数 _vdLs
    // args[0].toInt32() // =?= 指针_vdLs的值
    
    // args[1] //  jsonTxtOut_
    args[FnArgIdx_Fn06.jsonTxtOut_]=_ptrCxxStdStr__jsonTxtOut_ // 修改此次函数调用 出参 jsonTxtOut_ 为 _ptrCxxStdStr__jsonTxtOut_
    this.ptrCxxStdStr__jsonTxtOut_=_ptrCxxStdStr__jsonTxtOut_ //保留 之
    
    }
  
  //拿出参内容
  Leave(){
    //现在是函数离开时, 由于函数进入时 参数们args[k]被保存在thiz下, 因此此时可以拿出来
    logWriteLn(`[frida_js CxxFnOutArg_DestroyRtCxx.Leave] json(this)=[${JSON.stringify(this)}]`);

// cxxFunc06_outArgString 函数签名
//  /fridaAnlzAp/clang-var/runtime_cpp__vars_fn/include/runtime_cpp__vars_fn.h
// void destroyVarLs_inFn__RtCxx(_VarDeclLs * _vdLs, std::string * jsonTxtOut_)
    
    // 不关注参数 _vdLs

    //函数离开时, 获取到 函数出参 jsonTxtOut_
    if(this.ptrCxxStdStr__jsonTxtOut_){
        //调用std::string::size方法
        const stdStr_size:number=nativeFn__fridaHelper__cxxFuncWrap__std_string_size(this.ptrCxxStdStr__jsonTxtOut_)
        //为cstr分配缓冲区
        const cStrBuf:NativePointer=Memory.alloc(stdStr_size+FnOutArg_DestroyRtCxx.stdStr_2_fridaBuf_gap+1);
        //调用std::string::c_str方法
        const retCode:number=nativeFn__fridaHelper__cxxFuncWrap__std_string_cstr(this.ptrCxxStdStr__jsonTxtOut_, stdStr_size, cStrBuf);
        if(retCode==FnOutArg_DestroyRtCxx.stdStr_2_fridaBuf__OK){
          const jsonTxtOut_CStr:string| null=cStrBuf.readCString() // == jsonTxtOut_
          if(jsonTxtOut_CStr){
            logWriteLn(`[frida_js  CxxFnOutArg_DestroyRtCxx.Leave] jsonTxtOut_CStr=[${jsonTxtOut_CStr}]`);
          }
        }
        //等效 c++语句为 delete ptrCxxStdStr__jsonTxtOut_
        nativeFn__fridaHelper__cxxFuncWrap__std_string_delete(this.ptrCxxStdStr__jsonTxtOut_ ) ;
    }
    
    }
    
    }