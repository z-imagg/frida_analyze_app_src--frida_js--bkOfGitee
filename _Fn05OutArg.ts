// [依赖] : _logFile.ts/logWriteLn

enum FnArgIdx_DestroyRtC00{
// destroyVarLs_inFn__RtC00 函数签名
// /fridaAnlzAp/clang-var/runtime_c__vars_fn/include/runtime_c__vars_fn.h
// void destroyVarLs_inFn__RtC00(_VarDeclLs * _vdLs, int jTxtOLimit, char* jsonTxtOut_, int* jTxtOLenOut_);
    _vdLs=0,
    jTxtOLimit=1,
    jsonTxtOut_=2,
    jTxtOLenOut_=3,
}
class FnOutArg_DestroyRtC00{
    
  int__jTxtOLimit:number
  charArr__jsonTxtOut_:NativePointer
  intPtr_jTxtOLenOut_:NativePointer
    
  static Enter(
    args:InvocationArguments,
    _int__jTxtOLimit:number,
    _charArr__jsonTxtOut_:NativePointer,
    _intPtr__jTxtOLenOut_:NativePointer
  ){
    return new FnOutArg_DestroyRtC00(args, _int__jTxtOLimit, _charArr__jsonTxtOut_,_intPtr__jTxtOLenOut_);
  }
    
//进入函数func05_userQuery的处理
  constructor(
    args:InvocationArguments,
    _int__jTxtOLimit:number,
    _charArr__jsonTxtOut_:NativePointer,
    _intPtr_jTxtOLenOut_:NativePointer
  ){
    
    
    // const arg0_toInt32:number=args[0].toInt32() // ==  _vdLs
    
    // args[1].toInt32() // == jTxtOLimit
    args[FnArgIdx_DestroyRtC00.jTxtOLimit]=new NativePointer(_int__jTxtOLimit);// 修改 输入参数 jTxtOLimit 为 _int__jTxtOLimit
    logWriteLn(`[frida_js Fn05OutArg.constructor] jTxtOLimit=[${_int__jTxtOLimit}]`); 
    this.int__jTxtOLimit=_int__jTxtOLimit
    
    // args[2].readCString() // == jsonTxtOut_
    args[FnArgIdx_DestroyRtC00.jsonTxtOut_]=_charArr__jsonTxtOut_ // 修改 入参 jsonTxtOut_ 为 _charArr__jsonTxtOut_
    logWriteLn(`[frida_js Fn05OutArg.constructor] jsonTxtOut_=[${_charArr__jsonTxtOut_}]`); 
    this.charArr__jsonTxtOut_=_charArr__jsonTxtOut_ //保留 之
    
    //  args[3].readInt() // == jTxtOLenOut_
    args[FnArgIdx_DestroyRtC00.jTxtOLenOut_]=_intPtr_jTxtOLenOut_ // 修改 入参 jTxtOLenOut_ 为 _intPtr_jTxtOLenOut_
    logWriteLn(`[frida_js Fn05OutArg.constructor] jTxtOLenOut_=[${_intPtr_jTxtOLenOut_}]`); 
    this.intPtr_jTxtOLenOut_=_intPtr_jTxtOLenOut_ //保留 之
    }
    
    //离开函数func05_userQuery的处理
      Leave(){
      //现在是函数离开时, 由于函数进入时 参数们args[k]被保存在thiz下, 因此此时可以拿出来
      logWriteLn(`[frida_js Fn05OutArg.Leave] json(this)=[${JSON.stringify(this)}]`);
    
// destroyVarLs_inFn__RtC00 函数签名
// void destroyVarLs_inFn__RtC00(_VarDeclLs * _vdLs, int jTxtOLimit, char* jsonTxtOut_, int* jTxtOLenOut_);
      
      //this.int__jTxtOLimit // == jTxtOLimit
      logWriteLn(`[frida_js  Fn05OutArg.Leave] int__jTxtOLimit=[${this.int__jTxtOLimit}]`); 
    
      //函数离开时, 获取到 函数出参 jsonTxtOut_
      const arg3_readCString:string| null=this.charArr__jsonTxtOut_.readCString() // == jsonTxtOut_
      if(arg3_readCString){
        logWriteLn(`[frida_js  Fn05OutArg.Leave] arg3_readCString=[${arg3_readCString}]`);
      }
      
      //函数离开时, 获取到 函数出参 jTxtOLenOut_
      const arg4_readInt:number=this.intPtr_jTxtOLenOut_.readInt() // == jTxtOLenOut_
      logWriteLn(`[frida_js  Fn05OutArg.Leave] arg4_readInt=[${arg4_readInt}]`);
      // this.intPtr_jTxtOLenOut_.writeInt(-88); // 修改 输入参数 jTxtOLenOut_ 为 -88; 这句是为了实验，并无业务目的
      }
    
    }