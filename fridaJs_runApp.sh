#!/usr/bin/env bash

cd /fridaAnlzAp/frida_js/

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同
bash ASLR_disable.sh


#激活py环境 、 py依赖安装
source py_envAct_depInstl.sh

#重新编译 ts 为 js 
bash ./rebuild_ts.sh

# 查找编译产物中的函数
objdump --syms app.elf | grep fun

# 从配置文件中读取应用名
_appPath=$(jq -r .appPath config.json)
_appName=$(basename $_appPath)
#运行frida命令前，删除所有之前产生的日志文件
logFPattern="InterceptFnSym-$_appName-*"
rm -v $logFPattern

outJsFPath=./InterceptFnSym_generated.js

# 以frida运行应用
sudo env "PATH=$PATH" frida  --load $outJsFPath        --file /app/qemu/build-v8.2.2/qemu-system-x86_64
ls -lht $logFPattern

exit 0
#日志后处理(暂时不要)
now="$(date +%s)"
#  'appName--' 是analyze_by_graph/config.py获取应用名称的依据, 不要乱动 
FridaOut="/gain/frida-out/appName--qemu-system-x86_64--v8.2.2" && mkdir -p ${FridaOut}
_LogFp_App="appOut-${now}.log"
_LogFP_Mix="${FridaOut}/Mix-${now}.log"
_LogFP_PrefPure="${FridaOut}/PrefixPure-${now}.log"
_LogFP_Pure="${FridaOut}/Pure-${now}.log"
#  目前日志文件软链接
_LogFP_PureNow_link="/gain/frida-out/PureNow.log"
md5sum $_LogFP_Mix > $_LogFP_Mix.md5sum.txt
# 日志后处理
#   提取出带前缀的纯净日志， 并 记录日志文件的数字签名
grep __@__@   $_LogFP_Mix >  $_LogFP_PrefPure
md5sum $_LogFP_PrefPure > $_LogFP_PrefPure.md5sum.txt
#   去掉前缀成为纯净日志， 并 记录日志文件的数字签名
sed 's/^__@__@//' $_LogFP_PrefPure > $_LogFP_Pure
#重新创建目前日志文件软链接"/gain/frida-out/PureNow.log"
unlink $_LogFP_PureNow_link ; ln -s $_LogFP_Pure $_LogFP_PureNow_link
md5sum $_LogFP_Pure > $_LogFP_Pure.md5sum.txt

#最终产物日志文件名举例： frida-out-Pure-1712031317.log  
#    其数字签名举例： frida-out-Pure-1712031317.log.md5sum.txt
