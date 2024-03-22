📦
1954 /frida-trace.js.map
2125 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AAAA,qEAAqE;AAErE,SAAS,MAAM;IAEX,eAAe;IACf,MAAM,SAAS,GAAkB,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC;IACtD,MAAM,IAAI,GAAe,IAAI,aAAa,CAAC,CAAC,CAAC,CAAC;IAC9C,GAAG;IAEH,MAAM,SAAS,GAAa,IAAI,SAAS,EAAE,CAAC;IAC5C,MAAM,OAAO,GAAa,SAAS,CAAC,IAAI,CAAC,IAAI,CAAC,CAAC;IAC/C,IAAG,OAAO,IAAG,IAAI,EAAC;QACd,OAAM;KACT;IACD,MAAM,SAAS,GAAU,OAAO,CAAC,IAAI,CAAC;IAE9B,MAAM,QAAQ,GAAY,OAAO,CAAC,kBAAkB,EAAE,CAAC;IACvD,OAAO,CAAC,MAAM,CAAC,QAAQ,EAAE;QACrB,MAAM,EAAE;YACJ,IAAI,EAAE,IAAI;SACb;QACD,SAAS,EAAE,UAAS,MAAkB;YAClC,MAAM,SAAS,GAAuB,OAAO,CAAC,KAAK,CAAC,MAAM,CAAwB,CAAC;YACnF,IAAI,WAAW,GAAG,CAAC,CAAC;YACpB,IAAI,QAAQ,GAAG,IAAI,CAAC;YACpB,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,SAAS,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;gBACvC,MAAM,GAAG,GAAC,SAAS,CAAC,CAAC,CAAC,CAAC;gBACvB,yCAAyC;gBACzC,IAAI,GAAG,CAAC,CAAC,CAAC,KAAK,MAAM,EAAE;oBACnB,MAAM,KAAK,GAAuB,GAA4B,CAAA;oBAC9D,IAAI,QAAQ,GAAoB,KAAK,CAAC,CAAC,CAAmB,CAAC,CAAC,OAAO;oBACnE,IAAI,MAAM,GAAmB,KAAK,CAAC,CAAC,CAAmB,CAAC,CAAG,OAAO;oBAClE,IAAI,KAAK,GAAG,KAAK,CAAC,CAAC,CAAC,CAAC,CAAI,QAAQ;oBACjC,IAAI,WAAW,GAAG,EAAE,CAAC;oBACrB,IAAI,SAAS,GAAG,EAAE,CAAC;oBACnB,IAAI,MAAM,CAAC,OAAO,CAAC,SAAS,CAAC,IAAI,CAAC,IAAI,MAAM,CAAC,OAAO,CAAC,SAAS,CAAC,GAAG,CAAC,SAAS,CAAC,CAAC,GAAG,CAAC,EAAE;wBAChF,IAAI,QAAQ,EAAE;4BACV,QAAQ,GAAG,KAAK,CAAC;4BACjB,WAAW,GAAG,KAAK,CAAC;yBACvB;wBACD,IAAI,oBAAoB,GAAG,IAAI,GAAG,QAAQ,CAAC,GAAG,CAAC,SAAS,CAAC,GAAG,IAAI,CAAC;wBACjE,IAAI,kBAAkB,GAAG,IAAI,GAAG,QAAQ,CAAC,GAAG,CAAC,SAAS,CAAC,GAAG,GAAG,CAAC;wBAC9D,IAAI,MAAM,GAAG,CAAC,KAAK,GAAG,WAAW,CAAC,CAAC;wBACnC,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,MAAM,EAAE,CAAC,EAAE,EAAE;4BAC7B,SAAS,GAAG,SAAS,GAAG,GAAG,CAAC;yBAC/B;wBACD,WAAW,GAAG,SAAS,GAAG,kBAAkB,GAAG,GAAG,GAAG,oBAAoB,GAAG,GAAG,GAAG,MAAM,GAAG,MAAM,CAAC;wBAClG,OAAO,CAAC,GAAG,CAAC,WAAW,CAAC,CAAC;qBAC5B;iBACJ;aACJ;QACL,CAAC;KACJ,CAAC,CAAA;IAEF,OAAO,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAC;AAEvC,CAAC"}
✄
//from  https://gitee.com/x619920921/frida-js/raw/main/frida-trace.js
function myFunc() {
    //{ TODO 请用正确的值
    const base_addr = new NativePointer(0);
    const addr = new NativePointer(0);
    //}
    const moduleMap = new ModuleMap();
    const _module = moduleMap.find(addr);
    if (_module == null) {
        return;
    }
    const base_size = _module.size;
    const threadId = Process.getCurrentThreadId();
    Stalker.follow(threadId, {
        events: {
            call: true
        },
        onReceive: function (events) {
            const allEvents = Stalker.parse(events);
            let first_depth = 0;
            let is_first = true;
            for (let i = 0; i < allEvents.length; i++) {
                const evt = allEvents[i];
                // 调用的流程, location是哪里发生的调用, target是调用到了哪里
                if (evt[0] === "call") {
                    const scEvt = evt;
                    let location = scEvt[1]; // 调用地址
                    let target = scEvt[2]; // 目标地址
                    let depth = scEvt[3]; // depth
                    let description = '';
                    let space_num = '';
                    if (target.compare(base_addr) >= 0 && target.compare(base_addr.add(base_size)) < 0) {
                        if (is_first) {
                            is_first = false;
                            first_depth = depth;
                        }
                        let location_description = ' [' + location.sub(base_addr) + '] ';
                        let target_description = ' [' + location.sub(base_addr) + ']';
                        let length = (depth - first_depth);
                        for (let j = 0; j < length; j++) {
                            space_num = space_num + ' ';
                        }
                        description = space_num + target_description + '(' + location_description + ')' + ' -- ' + length;
                        console.log(description);
                    }
                }
            }
        }
    });
    Stalker.unfollow(threadId);
}