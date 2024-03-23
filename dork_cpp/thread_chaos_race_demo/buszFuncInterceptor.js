function buszFunIntercept() {
    let gFnCallId = 0;
    const fnAdrLs = DebugSymbol.findFunctionsMatching("*buszFunc*");
    const fnAdr = fnAdrLs[0];
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    console.log(`fnSym=${JSON.stringify(fnSym)}`);
    Interceptor.attach(fnAdr, {
        onEnter: function (args) {
            const cThId = Process.getCurrentThreadId();
            const threadIdx = args[0].toInt32();
            const callId = args[1].toInt32();
            gFnCallId++;
            this.fnCallId = gFnCallId;
            console.log(`cThId=${cThId},OnEnter_fnCallId=${this.fnCallId},arg.threadIdx_${threadIdx},arg.callId_${callId}`);
        },
        onLeave: function (retval) {
            const cThId = Process.getCurrentThreadId();
            console.log(`cThId=${cThId},OnLeave_fnCallId=${this.fnCallId}`);
        }
    });
}
buszFunIntercept();
