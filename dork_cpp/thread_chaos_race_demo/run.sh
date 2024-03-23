#!/usr/bin/env bash

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0


cd /fridaAnlzAp/frida_js/dork_cpp/thread_chaos_race_demo/
g++ -g ThreadChaosRaceDemo.cpp -o  ThreadChaosRaceDemo.elf


npx frida-compile  buszFuncInterceptor.ts --no-source-maps --output buszFuncInterceptor.js  && \
#删除frida-compile生成的 js文件开头 乱七八糟的 几行
sed -i '1,/buszFunc拦截js脚本/d' buszFuncInterceptor.js && \
frida  --load ./buszFuncInterceptor.js      --file ThreadChaosRaceDemo.elf  
#不要用--output 也不要用 tee ，否则 目标进程输出和frida输出会被分离、而且frida可能会报错
# Fatal Python error: _enter_buffered_busy: could not acquire lock for <_io.BufferedReader name='<stdin>'> at interpreter shutdown, possibly due to daemon threads
# Python runtime state: finalizing (tstate=0x0000000000779910)
# Current thread 0x00007ffff7eae440 (most recent call first):
#   <no Python frame>

# 即 不要写  --output out.log | tee mix_out.log

