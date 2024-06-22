// [依赖] : _logFile.ts/logWriteLn

enum Fn05ArgIdx{
// destroyVarLs_inFn__RtC00 函数签名
// /fridaAnlzAp/clang-var/runtime_c__vars_fn/include/runtime_c__vars_fn.h
// void destroyVarLs_inFn__RtC00(_VarDeclLs *_vdLs, int jsonTxtOutLimit, char* jsonTxtOut_, int* jsonTxtOutLen_);
// float func05_userQuery(char sex, int userId, int userName_limit, char* userName_out_, int* userName_length_out_);

    _vdLs=0,
    jsonTxtOutLimit=1,
    jsonTxtOut_=2,
    jsonTxtOutLen_=3,
}
class FnOutArg_DestroyRtC00{
    
  int__jsonTxtOutLimit:number
  charArr__jsonTxtOut_:NativePointer
  intPtr_jsonTxtOutLen_:NativePointer
    
  static Enter(
    args:InvocationArguments,
    _int__jsonTxtOutLimit:number,
    _charArr__jsonTxtOut_:NativePointer,
    _intPtr__jsonTxtOutLen_:NativePointer
  ){
    return new FnOutArg_DestroyRtC00(args, _int__jsonTxtOutLimit, _charArr__jsonTxtOut_,_intPtr__jsonTxtOutLen_);
  }
    
//进入函数func05_userQuery的处理
  constructor(
    args:InvocationArguments,
    _int__jsonTxtOutLimit:number,
    _charArr__jsonTxtOut_:NativePointer,
    _intPtr_jsonTxtOutLen_:NativePointer
  ){
    
    
    // const arg0_toInt32:number=args[0].toInt32() // ==  sex
    
    // const arg1_toInt32:number=args[1].toInt32() // == userId
    
    // args[2].toInt32() // == userName_limit
    args[Fn05ArgIdx.jsonTxtOutLimit]=new NativePointer(_int__jsonTxtOutLimit);// 修改 输入参数 userName_limit 为 _int__jsonTxtOutLimit
    logWriteLn(`[frida_js Fn05OutArg.constructor] jsonTxtOutLimit=[${_int__jsonTxtOutLimit}]`); 
    this.int__jsonTxtOutLimit=_int__jsonTxtOutLimit
    
    // const arg3_readCString:string| null=args[3].readCString() // == jsonTxtOut_
    args[Fn05ArgIdx.jsonTxtOut_]=_charArr__jsonTxtOut_ // 修改 入参 jsonTxtOut_ 为 _charArr__jsonTxtOut_
    logWriteLn(`[frida_js Fn05OutArg.constructor] jsonTxtOut_=[${_charArr__jsonTxtOut_}]`); 
    this.charArr__jsonTxtOut_=_charArr__jsonTxtOut_ //保留 之
    
    // const arg4_readInt:number=args[4].readInt() // == jsonTxtOutLen_
    args[Fn05ArgIdx.jsonTxtOutLen_]=_intPtr_jsonTxtOutLen_ // 修改 入参 jsonTxtOutLen_ 为 _intPtr_jsonTxtOutLen_
    logWriteLn(`[frida_js Fn05OutArg.constructor] jsonTxtOutLen_=[${_intPtr_jsonTxtOutLen_}]`); 
    this.intPtr_jsonTxtOutLen_=_intPtr_jsonTxtOutLen_ //保留 之
    }
    
    //离开函数func05_userQuery的处理
      Leave(){
      //现在是函数离开时, 由于函数进入时 参数们args[k]被保存在thiz下, 因此此时可以拿出来
      // const userName_limit:NativePointer=this.int__userName_limit
      // const userName_out_:NativePointer=this.charArr__jsonTxtOut_
      // const userName_length_out_:NativePointer=this.intPtr_userName_length_out_
      logWriteLn(`[frida_js Fn05OutArg.Leave] json(this)=[${JSON.stringify(this)}]`);
    
      // func05_userQuery 函数签名
      // /fridaAnlzAp/frida_js_demo/app.c
      // float func05_userQuery(char sex, int userId, int userName_limit, char* userName_out_, int* userName_length_out_);
      
      const arg2_toInt32:number=this.int__jsonTxtOutLimit // == userName_limit
      logWriteLn(`[frida_js  Fn05OutArg.Leave] arg2_toInt32=[${arg2_toInt32}]`); 
    
      //函数离开时, 获取到 函数出参 userName_out_
      const arg3_readCString:string| null=this.charArr__jsonTxtOut_.readCString() // == userName_out_
      if(arg3_readCString){
        logWriteLn(`[frida_js  Fn05OutArg.Leave] arg3_readCString=[${arg3_readCString}]`);
      }
      
      //函数离开时, 获取到 函数出参 userName_length_out_
      const arg4_readInt:number=this.intPtr_jsonTxtOutLen_.readInt() // == userName_length_out_
      logWriteLn(`[frida_js  Fn05OutArg.Leave] arg4_readInt=[${arg4_readInt}]`);
      // this.intPtr_jsonTxtOutLen_.writeInt(-88); // 修改 输入参数 userName_length_out_ 为 -88; 这句是为了实验，并无业务目的
      }
    
    }