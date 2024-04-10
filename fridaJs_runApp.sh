#!/usr/bin/env bash

#去此脚本所在目录
f=$(readlink -f ${BASH_SOURCE[0]})  ; d=$(dirname $f)
cd $d

#重新编译 简单应用
bash /fridaAnlzAp/frida_js/simple_app_build.sh

#重新编译 ts 为 js 
bash -x /fridaAnlzAp/frida_js/rebuild_ts.sh

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

function get_bash_en_dbg() {
  bash_en_dbg=false; [[ $- == *x* ]] && bash_en_dbg=true #记录bash是否启用了调试模式
}

cd /fridaAnlzAp/frida_js/

#安装frida py工具
# 临时关闭bash调试模式， 是 由于 miniconda 的 activate 脚本内容太大，从而减少视觉干扰
get_bash_en_dbg  #记录bash是否启用了调试模式
$bash_en_dbg && set +x #如果启用了调试模式, 则关闭调试模式
source /app/Miniconda3-py310_22.11.1-1/bin/activate
$bash_en_dbg && set -x #如果启用了调试模式, 则打开调试模式
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip install -r requirements.txt

#删除旧日志
rm -frv *.log

#运行frida
now="$(date +%s)"
FridaOut="frida-out"
_LogFP_Mix="${FridaOut}-Mix-${now}.log"
_LogFP_PrefPure="${FridaOut}-PrefixPure-${now}.log"
_LogFP_Pure="${FridaOut}-Pure-${now}.log"
# 运行frida , 产生日志文件 ， 并 记录日志文件的数字签名
#  注意　   　目标应用和其参数　比如为 "aaa.elf arg1 arg2" frida不允许其中的参数以中划线开头　否则会被当成是frida的参数, 
#     即 frida只允许应用携带非中划线参数
frida   --load ./InterceptFnSym.js    --output $_LogFP_Mix    --file /fridaAnlzAp/frida_js/simple_app.elf argv1
md5sum $_LogFP_Mix > $_LogFP_Mix.md5sum.txt
# 日志后处理
#   提取出带前缀的纯净日志， 并 记录日志文件的数字签名
grep __@__@   $_LogFP_Mix >  $_LogFP_PrefPure
md5sum $_LogFP_PrefPure > $_LogFP_PrefPure.md5sum.txt
#   去掉前缀成为纯净日志， 并 记录日志文件的数字签名
sed 's/^__@__@//' $_LogFP_PrefPure > $_LogFP_Pure
md5sum $_LogFP_Pure > $_LogFP_Pure.md5sum.txt

#最终产物日志文件名举例： frida-out-Pure-1712031317.log  
#    其数字签名举例： frida-out-Pure-1712031317.log.md5sum.txt

ls -lh *.log

grep main $_LogFP_Pure


#输出如下， "获取到main函数" 且 Interceptor.attach(onEnter) 正常拦截到main函数
_="""
     ____
    / _  |   Frida 16.0.7 - A world-class dynamic instrumentation toolkit
   | (_| |
    > _  |   Commands:
   /_/ |_|       help      -> Displays the help system
   . . . .       object?   -> Display information about 'object'
   . . . .       exit/quit -> Exit
   . . . .
   . . . .   More info at https://frida.re/docs/home/
   . . . .
   . . . .   Connected to Local System (id=local)
Spawned `/fridaAnlzAp/frida_js/simple_app.elf argv1`. Resuming main thread!
message: {'type': 'send', 'payload': '##1712753167214,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x7ffff7c45d60;  进度【168~2801 】'} data: None
message: {'type': 'send', 'payload': '##1712753167470,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x555555555000;  进度【2793~2801 】'} data: None
message: {'type': 'send', 'payload': '##1712753167470,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x555555555040;  进度【2794~2801 】'} data: None
message: {'type': 'send', 'payload': '##1712753167470,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x555555555070;  进度【2795~2801 】'} data: None
message: {'type': 'send', 'payload': '##1712753167470,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x5555555550a0;  进度【2796~2801 】'} data: None
message: {'type': 'send', 'payload': '##1712753167471,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x5555555550e0;  进度【2797~2801 】'} data: None
message: {'type': 'send', 'payload': '##1712753167471,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x555555555120;  进度【2798~2801 】'} data: None
message: {'type': 'send', 'payload': '获取到main函数,fnSym=0x555555555129 simple_app.elf!main /fridaAnlzAp/frida_js/simple_app.c:1:11'} data: None
message: {'type': 'send', 'payload': '##1712753167471,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x555555555129;  进度【2799~2801 】'} data: None
message: {'type': 'send', 'payload': '##1712753167471,04/10/2024, 08:46:07 PM;Interceptor.attach fnAdr=0x555555555138;  进度【2800~2801 】'} data: None
message: {'type': 'send', 'payload': '##只有首次新建对象tmPnt，{"processId":118547,"thrdId":118547,"curTmPnt":0}'} data: None
[Local::simple_app.elf ]->
__@__@{"tmPnt":1,"logId":1,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x555555555040","fnCallId":1,"fnSym":{"address":"0x555555555040","name":"_start","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x555555555040","name":"_start","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0}'} data: None
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x555555555000","name":"_init","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0}'} data: None

__@__@{"tmPnt":2,"logId":2,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x555555555000","fnCallId":2,"fnSym":{"address":"0x555555555000","name":"_init","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}

__@__@{"tmPnt":3,"logId":3,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x555555555000","fnCallId":2,"fnSym":{"address":"0x555555555000","name":"_init","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x555555555120","name":"frame_dummy","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0}'} data: None

__@__@{"tmPnt":4,"logId":4,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x555555555120","fnCallId":3,"fnSym":{"address":"0x555555555120","name":"frame_dummy","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x5555555550a0","name":"register_tm_clones","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0}'} data: None

__@__@{"tmPnt":5,"logId":5,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x5555555550a0","fnCallId":4,"fnSym":{"address":"0x5555555550a0","name":"register_tm_clones","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}

__@__@{"tmPnt":6,"logId":6,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x5555555550a0","fnCallId":4,"fnSym":{"address":"0x5555555550a0","name":"register_tm_clones","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}

__@__@{"tmPnt":7,"logId":7,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x555555555120","fnCallId":3,"fnSym":{"address":"0x555555555120","name":"frame_dummy","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x555555555129","name":"main","moduleName":"simple_app.elf","fileName":"/fridaAnlzAp/frida_js/simple_app.c","lineNumber":1,"column":11}'} data: None

__@__@{"tmPnt":8,"logId":8,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x555555555129","fnCallId":5,"fnSym":{"address":"0x555555555129","name":"main","moduleName":"simple_app.elf","fileName":"/fridaAnlzAp/frida_js/simple_app.c","lineNumber":1,"column":11},"modueBase":"0x555555554000"}

__@__@{"tmPnt":9,"logId":9,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x555555555129","fnCallId":5,"fnSym":{"address":"0x555555555129","name":"main","moduleName":"simple_app.elf","fileName":"/fridaAnlzAp/frida_js/simple_app.c","lineNumber":1,"column":11},"modueBase":"0x555555554000"}

__@__@{"tmPnt":10,"logId":10,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x7ffff7c45d60","fnCallId":6,"fnSym":{"address":"0x7ffff7c45d60","name":"__call_tls_dtors","moduleName":"libc.so.6","fileName":"","lineNumber":0,"column":0},"modueBase":"0x7ffff7c00000"}

__@__@{"tmPnt":11,"logId":11,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x7ffff7c45d60","fnCallId":6,"fnSym":{"address":"0x7ffff7c45d60","name":"__call_tls_dtors","moduleName":"libc.so.6","fileName":"","lineNumber":0,"column":0},"modueBase":"0x7ffff7c00000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x7ffff7c45d60","name":"__call_tls_dtors","moduleName":"libc.so.6","fileName":"","lineNumber":0,"column":0}'} data: None

__@__@{"tmPnt":12,"logId":12,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x5555555550e0","fnCallId":7,"fnSym":{"address":"0x5555555550e0","name":"__do_global_dtors_aux","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x5555555550e0","name":"__do_global_dtors_aux","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0}'} data: None

__@__@{"tmPnt":13,"logId":13,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x555555555070","fnCallId":8,"fnSym":{"address":"0x555555555070","name":"deregister_tm_clones","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x555555555070","name":"deregister_tm_clones","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0}'} data: None

__@__@{"tmPnt":14,"logId":14,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x555555555070","fnCallId":8,"fnSym":{"address":"0x555555555070","name":"deregister_tm_clones","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}

__@__@{"tmPnt":15,"logId":15,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x5555555550e0","fnCallId":7,"fnSym":{"address":"0x5555555550e0","name":"__do_global_dtors_aux","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
message: {'type': 'send', 'payload': '##只有首次查调试信息文件，{"address":"0x555555555138","name":"_fini","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0}'} data: None

__@__@{"tmPnt":16,"logId":16,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x555555555138","fnCallId":9,"fnSym":{"address":"0x555555555138","name":"_fini","moduleName":"simple_app.elf","fileName":"","lineNumber":0,"column":0},"modueBase":"0x555555554000"}
Process terminated
[Local::simple_app.elf ]->

Thank you for using Frida!
-rwxrwxrwx 1 z z 4.4K  4月 10 20:46 frida-out-Mix-1712753167.log
-rwxrwxrwx 1 z z 4.4K  4月 10 20:46 frida-out-PrefixPure-1712753167.log
-rwxrwxrwx 1 z z 4.3K  4月 10 20:46 frida-out-Pure-1712753167.log
{"tmPnt":8,"logId":8,"processId":118547,"curThreadId":118547,"direct":1,"fnAdr":"0x555555555129","fnCallId":5,"fnSym":{"address":"0x555555555129","name":"main","moduleName":"simple_app.elf","fileName":"/fridaAnlzAp/frida_js/simple_app.c","lineNumber":1,"column":11},"modueBase":"0x555555554000"}
{"tmPnt":9,"logId":9,"processId":118547,"curThreadId":118547,"direct":2,"fnAdr":"0x555555555129","fnCallId":5,"fnSym":{"address":"0x555555555129","name":"main","moduleName":"simple_app.elf","fileName":"/fridaAnlzAp/frida_js/simple_app.c","lineNumber":1,"column":11},"modueBase":"0x555555554000"}


"""