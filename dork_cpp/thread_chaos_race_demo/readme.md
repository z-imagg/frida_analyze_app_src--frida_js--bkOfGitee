##  结论: 多线程环境下 frida的 js函数 Interceptor.attach.OnEnter 是 被串行执行的 

## 分析过程

```bash -x run.sh``` 

其输出结果 说明了 : **frida保证了 多个线程 以 串行方式 进入 js函数 jsOnEnterFunc** ， 即 多线程环境下  Interceptor.attach.OnEnter 是 串行的 是 线程安全的

其中  ```Interceptor.attach.OnEnter == jsOnEnterFunc ```


### 理由 

#### 并发正确的样子

1. 最后值：   gVar==10

2. 取值过程：  gVar 依次 取遍 整数0到10

####  目标进程c++代码（反面例子）

目标进程c++代码 中的 准全局变量 gVar 没有作任何并发控制， 

- 最后值： gVar 不等于 10 、

- 取值过程：  gVar 依次 取了 很多乱七八糟的值 即 不是 整数0到的10

因此 **目标进程c++代码 中 函数 buszFunc  被  并发错误 的 执行了**

#### frida 控制的 js函数（正面例子）

frida 控制的 js函数 jsOnEnterFunc 中的 准全局变量 gVar， 

- 最后值：   gVar==10

- 取值过程：  gVar 依次 取遍 整数0到10

因此 **frida 控制的 js函数 jsOnEnterFunc   被  并发正确 的 执行了**


###  输出日志 
人工复制控制台的输出 如下：


```txt
(base) z@mchr:/fridaAnlzAp/frida_js/dork_cpp/thread_chaos_race_demo$ bash -x run.sh
+ echo 0
+ sudo tee /proc/sys/kernel/randomize_va_space
0
+ cat /proc/sys/kernel/randomize_va_space
0
+ cd /fridaAnlzAp/frida_js/dork_cpp/thread_chaos_race_demo/
+ g++ -g ThreadChaosRaceDemo.cpp -o ThreadChaosRaceDemo.elf
+ npx frida-compile buszFuncInterceptor.ts --no-source-maps --output buszFuncInterceptor.js
+ sed -i 1,/buszFunc拦截js脚本/d buszFuncInterceptor.js
+ frida --load ./buszFuncInterceptor.js --file ThreadChaosRaceDemo.elf

     ____
    / _  |   Frida 16.2.1 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
   . . . .
   . . . .   Connected to Local System (id=local)
Spawning `ThreadChaosRaceDemo.elf`...                                   
fnSym={"address":"0x555555556b0f","name":"buszFunc","moduleName":"ThreadChaosRaceDemo.elf","fileName":"/fridaAnlzAp/frida_js/dork_cpp/thread_chaos_race_demo/ThreadChaosRaceDemo.cpp","lineNumber":393,"column":7}
Spawned `ThreadChaosRaceDemo.elf`. Resuming main thread!                
js; cThId=37514,进入jsOnEnterFunc,gVar_0
[Local::ThreadChaosRaceDemo.elf ]-> c; 主线程进入休眠
                                    js; curThId=37514,离开jsOnEnterFunc,gVar_1,fnCallId_5001,C_arg.threadIdx_0,C_arg.callId_5001
js; cThId=37515,进入jsOnEnterFunc,gVar_1
c; 进入业务函数,threadIdx_0,fnCallId_5001,gVar_0
js; curThId=37515,离开jsOnEnterFunc,gVar_2,fnCallId_5002,C_arg.threadIdx_1,C_arg.callId_5002
js; cThId=37516,进入jsOnEnterFunc,gVar_2
c; 进入业务函数,threadIdx_1,fnCallId_5002,gVar_2
c; 进入业务函数,threadIdx_2,fnCallId_5003,gVar_4
js; curThId=37516,离开jsOnEnterFunc,gVar_3,fnCallId_5003,C_arg.threadIdx_2,C_arg.callId_5003
js; cThId=37517,进入jsOnEnterFunc,gVar_3
js; curThId=37517,离开jsOnEnterFunc,gVar_4,fnCallId_5004,C_arg.threadIdx_3,C_arg.callId_5004
js; cThId=37518,进入jsOnEnterFunc,gVar_4
c; 进入业务函数,threadIdx_3,fnCallId_5004,gVar_6
js; curThId=37518,离开jsOnEnterFunc,gVar_5,fnCallId_5005,C_arg.threadIdx_4,C_arg.callId_5005
js; cThId=37519,进入jsOnEnterFunc,gVar_5
c; 进入业务函数,threadIdx_4,fnCallId_5005,gVar_8
js; curThId=37519,离开jsOnEnterFunc,gVar_6,fnCallId_5006,C_arg.threadIdx_5,C_arg.callId_5006
js; cThId=37520,进入jsOnEnterFunc,gVar_6
c; 进入业务函数,threadIdx_5,fnCallId_5006,gVar_10
c; 进入业务函数,threadIdx_6,fnCallId_5007,gVar_12
js; curThId=37520,离开jsOnEnterFunc,gVar_7,fnCallId_5007,C_arg.threadIdx_6,C_arg.callId_5007
js; cThId=37521,进入jsOnEnterFunc,gVar_7
c; 主线程退出
js; curThId=37521,离开jsOnEnterFunc,gVar_8,fnCallId_5008,C_arg.threadIdx_7,C_arg.callId_5008
js; cThId=37523,进入jsOnEnterFunc,gVar_8
c; 进入业务函数,threadIdx_7,fnCallId_5008,gVar_-134229952
js; curThId=37523,离开jsOnEnterFunc,gVar_9,fnCallId_5009,C_arg.threadIdx_9,C_arg.callId_5010
js; cThId=37522,进入jsOnEnterFunc,gVar_9
c; 进入业务函数,threadIdx_9,fnCallId_5010,gVar_-134229950
js; curThId=37522,离开jsOnEnterFunc,gVar_10,fnCallId_5010,C_arg.threadIdx_8,C_arg.callId_5009
Process terminated
[Local::ThreadChaosRaceDemo.elf ]->

Thank you for using Frida!

```



