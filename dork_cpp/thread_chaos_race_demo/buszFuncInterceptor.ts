//buszFunc拦截js脚本
function buszFunIntercept(){
    let gFnCallId:number = 0;

    const fnAdrLs=DebugSymbol.findFunctionsMatching("*buszFunc*")
    const fnAdr = fnAdrLs[0]
    const fnSym=DebugSymbol.fromAddress(fnAdr)
    console.log(`fnSym=${JSON.stringify(fnSym)}`)
    Interceptor.attach(fnAdr,{
        onEnter:function (this: InvocationContext, args: InvocationArguments) {
            const cThId:ThreadId=Process.getCurrentThreadId();
            const threadIdx:number = args[0].toInt32();
            const callId:number = args[1].toInt32();

            gFnCallId++;
            this.fnCallId=gFnCallId;

            console.log(`cThId=${cThId},OnEnter_fnCallId=${this.fnCallId},arg.threadIdx_${threadIdx},arg.callId_${callId}`)
        },
        onLeave:function (this: InvocationContext, retval: InvocationReturnValue) {
            const cThId:ThreadId=Process.getCurrentThreadId();
    
            console.log(`cThId=${cThId},OnLeave_fnCallId=${this.fnCallId}`)
        }
    })
}

buszFunIntercept()