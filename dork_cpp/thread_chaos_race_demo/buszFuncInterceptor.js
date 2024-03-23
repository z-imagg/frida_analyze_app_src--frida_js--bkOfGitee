function buszFunIntercept() {
    let gFnCallId = 0;
    const fnAdrLs = DebugSymbol.findFunctionsMatching("*buszFunc*");
    const fnAdr = fnAdrLs[0];
    const fnSym = DebugSymbol.fromAddress(fnAdr);
    console.log(`fnSym=${JSON.stringify(fnSym)}`);
    Interceptor.attach(fnAdr, {
        onEnter: function (args) {
            gFnCallId++;
            this.fnCallId = gFnCallId;
            console.log(`OnEnter_fnCallId=${this.fnCallId}`);
        },
        onLeave: function (retval) {
            console.log(`OnLeave_fnCallId=${this.fnCallId}`);
        }
    });
}
buszFunIntercept();
