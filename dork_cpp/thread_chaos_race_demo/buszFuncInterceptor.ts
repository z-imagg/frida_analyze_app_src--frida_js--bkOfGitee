//buszFunc拦截js脚本
function buszFunIntercept(){
    let gFnCallId:number = 0;

    const fnAdrLs=DebugSymbol.findFunctionsMatching("*buszFunc*")
    const fnAdr = fnAdrLs[0]
    const fnSym=DebugSymbol.fromAddress(fnAdr)
    console.log(`fnSym=${JSON.stringify(fnSym)}`)
    Interceptor.attach(fnAdr,{
        onEnter:function (this: InvocationContext, args: InvocationArguments) {
            gFnCallId++;
            this.fnCallId=gFnCallId;
            console.log(`OnEnter_fnCallId=${this.fnCallId}`)
        },
        onLeave:function (this: InvocationContext, retval: InvocationReturnValue) {
    
            console.log(`OnLeave_fnCallId=${this.fnCallId}`)
        }
    })
}

buszFunIntercept()