#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0


cd /fridaAnlzAp/frida_js/dork_cpp/thread_chaos_race_demo/
g++ -g -c  ThreadChaosRaceDemo.cpp -o ThreadChaosRaceDemo.obj
g++ -g ThreadChaosRaceDemo.obj -o ThreadChaosRaceDemo.elf


npx frida-compile  buszFuncInterceptor.ts --no-source-maps --output buszFuncInterceptor.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/buszFunc拦截js脚本/d' buszFuncInterceptor.js && \
frida  --load ./buszFuncInterceptor.js      --file ThreadChaosRaceDemo.elf

