#!/usr/bin/env bash

cd /fridaAnlzAp/frida_js/

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同
bash ASLR_disable.sh


#激活py环境 、 py依赖安装
source py_envAct_depInstl.sh

#重新编译 ts 为 js 
bash ./rebuild_ts.sh

# 从配置文件中读取应用名
_appPath=$(jq -r .appPath config.json)
_appName=$(basename $_appPath)

_ErrCode=2
_ErrMsg2="错误2,可执行应用程序不存在[$_appPath]，错误代码[$_ErrCode]"
[[ -f $_appPath ]] || { echo $_ErrMsg2 ; exit $_ErrCode ;}

# 查找编译产物中的函数
objdump --syms $_appPath | grep TL_TmPnt__update

#运行frida命令前，删除所有之前产生的日志文件
logFPattern="InterceptFnSym-$_appName-*"
rm -v $logFPattern

outJsFPath=./InterceptFnSym_generated.js

# 以frida运行应用
sudo env "PATH=$PATH" frida  --load $outJsFPath        --file  $_appPath
ls -lht $logFPattern

exit 0
#日志后处理(日志文件更名)
#  'appName--' 是analyze_by_graph/config.py获取应用名称的依据, 不要乱动 
FridaOut="/gain/frida-out/appName--${_appName}" && mkdir -p ${FridaOut}
_LogFP_Pure="${FridaOut}/Pure-${now}.log"
mv $(ls  $logFPattern) $_LogFP_Pure
