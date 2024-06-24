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
normal_appRun  > normal_appRun.log
echo -n "原生运行sleuthkit获得的vdLs行数为:"
grep --fixed-strings '{"vdLs":' normal_appRun.log  | wc -l 
#原生运行sleuthkit获得的vdLs行数为:56006

# 查找编译产物中的函数
#  查找编译产物中 std::string的无参构造函数
objdump --syms $_appPath 2>>./error.log  | grep fridaHelper
objdump --syms $_appPath 2>>./error.log | grep " main"
objdump --syms $_appPath 2>>./error.log | grep TL_TmPnt__update

#运行frida命令前，删除所有之前产生的日志文件
logF="InterceptFnSym-$_appName.log"
# rm -v $logF

outJsFPath=./InterceptFnSym_generated.js

# 以frida运行应用
$_CondaFrida  --load $outJsFPath        --file  $_appPath
_exitCode=$?
echo "退出代码为$_exitCode"


outTsFPath=InterceptFnSym_generated.ts
#删除中间结果文件 .ts .js
#rm -v $outTsFPath $outJsFPath
mv  $outTsFPath  ${outTsFPath}.txt
mv  $outJsFPath  ${outJsFPath}.txt

ls -lht $logF
wc -l $logF

echo -n "frida_js运行sleuthkit获得的vdLs行数为:"
grep --fixed-strings '{"vdLs":' $logF | wc -l 
#frida_js运行sleuthkit获得的vdLs行数为:56112

# grep --fixed-strings "[frida_js  CxxFnOutArg_DestroyRtCxx.Leave] jsonTxtOut_CStr="   InterceptFnSym-tsk_recover.log |wc -l     #1
# grep --fixed-strings "[frida_js  Fn05OutArg.Leave] arg3_readCString="   InterceptFnSym-tsk_recover.log  | wc -l  #148

#frida_js运行sleuthkit, 能正常跑完, clang-var的runtime c 的destroy函数的出参数jsonTxtOut_, 缓冲区为2048字节 长度不够, 长度超出日志 如下
grep --fixed-strings "[Err01_Beyond_JsonTxtOutLimit]" InterceptFnSym-tsk_recover.log  
#输出有很多行, 列举最长json如下:
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[40877],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[40877],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[5912],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[7142],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[5912],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[3271],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[6445],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[6281],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[5912],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[6281],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[40877],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[5912],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[7142],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[5912],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[3271],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[6445],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[6281],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[5912],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[2296],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[6281],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
# [frida_js  Fn05OutArg.Leave] arg3_readCString=[[Err01_Beyond_JsonTxtOutLimit] ,jsonTxtLen=[51719],jTxtOLimit=[2048],__Gap_Danger_Char_Cnt=[9]; fixWay: use bigger jsonTxtOut_
