function buszFunIntercept() {
    let gFnCallId = 5000;
    const fnAdrLs = DebugSymbol.findFunctionsMatching("*buszFunc*");
    const fnAdr = fnAdrLs[0];
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    console.log(`fnSym=${JSON.stringify(fnSym)}`);
    Interceptor.attach(fnAdr, {
        onEnter: function (args) {
            const cThId = Process.getCurrentThreadId();
            this.threadIdx = args[0].toInt32();
            this.callId = args[1].toInt32();
            this.fnCallId = ++gFnCallId;
            console.log(`js; cThId=${cThId},OnEnter,fnCallId_${this.fnCallId},C_arg.threadIdx_${this.threadIdx},C_arg.callId_${this.callId}`);
        },
        onLeave: function (retval) {
            const cThId = Process.getCurrentThreadId();
            console.log(`js; cThId=${cThId},OnLeave,fnCallId_${this.fnCallId},C_arg.threadIdx_${this.threadIdx},C_arg.callId_${this.callId}`);
        }
    });
}
buszFunIntercept();
