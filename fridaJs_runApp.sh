#!/bin/bash

cd /fridaAnlzAp/frida_js/

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同
bash ASLR_disable.sh


#激活py环境 、 py依赖安装
source py_envAct_depInstl.sh
#输出 变量 _CondaFrida

#重新编译 ts 为 js 
bash ./rebuild_ts.sh

# 从配置文件中读取应用名
_appPath=$(jq -r .appPath config.json)
_appArgLsAsTxt=$(jq -r .appArgLsAsTxt config.json)
_appName=$(basename $_appPath)

_ErrCode=2
_ErrMsg2="错误2,可执行应用程序不存在[$_appPath]，错误代码[$_ErrCode]"
[[ -f $_appPath ]] || { echo $_ErrMsg2 ; exit $_ErrCode ;}

#应用运行 函数
function normal_appRun(){
#尝试直接运行该应用,以确认是否能正常运行
local _appCmdFull="$_appPath $_appArgLsAsTxt"
local _Err3Code=3
local _Err3Msg="错误3,直接运行该应用失败[$_appCmdFull]，错误代码[$_Err3Code]"
$_appCmdFull ||  { echo $_Err3Msg ; exit $_Err3Code ;}
}
#应用运行前准备工作
source  /app2/sleuthkit/app_run/appRun.sh && pre_appRun
#直接运行应用
# normal_appRun 1>/dev/null

# 查找编译产物中的函数
#  查找编译产物中 std::string的无参构造函数
objdump --syms $_appPath | grep fridaHelper
objdump --syms $_appPath 2>./error.log | grep " main"
objdump --syms $_appPath 2>./error.log | grep TL_TmPnt__update

#运行frida命令前，删除所有之前产生的日志文件
logFPattern="InterceptFnSym-$_appName-*"
# rm -v $logFPattern

outJsFPath=./InterceptFnSym_generated.js

# 以frida运行应用
$_CondaFrida  --load $outJsFPath        --file  $_appPath



outTsFPath=InterceptFnSym_generated.ts
#删除中间结果文件 .ts .js
#rm -v $outTsFPath $outJsFPath
mv  $outTsFPath  ${outTsFPath}.txt
mv  $outJsFPath  ${outJsFPath}.txt

ls -lht $logFPattern
wc -l $logFPattern
