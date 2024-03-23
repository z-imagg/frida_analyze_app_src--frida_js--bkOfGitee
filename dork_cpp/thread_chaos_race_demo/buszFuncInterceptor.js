function loop(loopSize) {
    for (let k = 0; k < loopSize; k++) {
        ;
    }
}
function buszFunIntercept() {
    let gFnCallId = 5000;
    let gVar = 0;
    const fnAdrLs = DebugSymbol.findFunctionsMatching("*buszFunc*");
    const fnAdr = fnAdrLs[0];
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    console.log(`fnSym=${JSON.stringify(fnSym)}`);
    Interceptor.attach(fnAdr, {
        onEnter: function jsOnEnterFunc(args) {
            const curThId = Process.getCurrentThreadId();
            this.threadIdx = args[0].toInt32();
            this.callId = args[1].toInt32();
            console.log(`js; cThId=${curThId},进入jsOnEnterFunc,gVar_${gVar}`);
            // const x:number = ++gVar;
            ++gVar;
            for (let i = 0; i < 500; i++) {
                ++gVar;
                for (let k = 0; k < 19 * 1000; k++) {
                    ;
                }
                --gVar;
            }
            this.fnCallId = ++gFnCallId;
            console.log(`js; curThId=${curThId},离开jsOnEnterFunc,gVar_${gVar},fnCallId_${this.fnCallId},C_arg.threadIdx_${this.threadIdx},C_arg.callId_${this.callId}`);
        },
        onLeave: function jsOnLeaveFunc(retval) {
            const cThId = Process.getCurrentThreadId();
            console.log(`js; curThId=${cThId},OnLeave,fnCallId_${this.fnCallId},gVar_${gVar},C_arg.threadIdx_${this.threadIdx},C_arg.callId_${this.callId}`);
        }
    });
}
buszFunIntercept();
