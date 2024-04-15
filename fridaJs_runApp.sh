#!/usr/bin/env bash

#去此脚本所在目录
f=$(readlink -f ${BASH_SOURCE[0]})  ; d=$(dirname $f)
cd $d

#重新编译 ts 为 js 
bash -x /fridaAnlzAp/frida_js/rebuild_ts.sh

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0


cd /fridaAnlzAp/frida_js/

#安装frida py工具
source /app/Miniconda3-py310_22.11.1-1/bin/activate
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip install -r requirements.txt

#删除旧日志

#运行frida
# 运行frida , 产生日志文件 ， 并 记录日志文件的数字签名
#  注意　   　目标应用和其参数　比如为 "aaa.elf arg1 arg2" frida不允许其中的参数以中划线开头　否则会被当成是frida的参数, 
#     即 frida只允许应用携带非中划线参数
sudo env "PATH=$PATH" frida  --load ./InterceptFnSym.js    --output out.log    --file /usr/bin/ls
