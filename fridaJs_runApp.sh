#!/bin/bash

#【术语】  frida_js主脚本
#【备注】  
#【使用】
#开发常用
#    bash /fridaAnlzAp/frida_js/fridaJs_runApp.sh
#您认为此次日志文件可以作为生产用， 从fridaJs本地日志文件产生fridaJs全局纯净日志文件, 以使得后续步骤 项目 analyze_by_graph 能看到 该日志文件 
#  do__from_LocalFridaJsLog_Generate_GlobalFridaJsPureLog=true  bash /fridaAnlzAp/frida_js/fridaJs_runApp.sh

_PrjHome=/fridaAnlzAp/frida_js/
cd $_PrjHome

#临时启用coredump, （崩溃时生成coredump文件 以 协助调查问题）.   必须要source执行 否则 ulimit不生效
source /app/bash-simplify/coredump_enable_tmp.sh
coredump_enable_tmp

#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同
bash ASLR_disable.sh

#加载依赖脚本
source /app/bash-simplify/condaEnvActivate_pipInstallRequirements.sh

#此脚本 允许某行出错 、允许使用未定义变量
#'-e': 任一语句异常将导致此脚本终止; '-u': 使用未声明变量将导致异常;  
set +e +u  

# miniconda激活环境、pip安装项目目录下的requirements.txt依赖
_CondaHome=/app/Miniconda3-py310_22.11.1-1
_condaEnvActivate_pipInstallRequirements  $_CondaHome  $_PrjHome
_CondaBin=$_CondaHome/bin
# _CondaActv=$_CondaBin/activate
# _CondaPip=$_CondaBin/pip
_CondaPy=$_CondaBin/python
_CondaFrida=$_CondaBin/frida
_CondaFridaCompile=$_CondaBin/frida-compile



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
source  /app2/jdk-jdk-24-0/app_run/appRun.sh && pre_appRun
#直接运行应用
normal_appRun  > normal_appRun.log
# echo -n "原生运行sleuthkit获得的vdLs行数为:"
# grep --fixed-strings '{"vdLs":' normal_appRun.log  | wc -l 
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
# 2301906 InterceptFnSym-tsk_recover.log
# -rwxrwxrwx   294M  6月 24 13:59 InterceptFnSym-tsk_recover.log


echo -n "frida_js运行sleuthkit获得的vdLs行数为:"
grep --fixed-strings '{"vdLs":' $logF | wc -l 
#frida_js运行sleuthkit获得的vdLs行数为:56006


#frida_js运行sleuthkit,调整出参jsonTxtOut_ 长度超过 sleuthkit运行出现的最大长度， 则正常运行  , 无超出日志, 
grep --fixed-strings "[Err01_Beyond_JsonTxtOutLimit]" InterceptFnSym-tsk_recover.log  


#您认为此次日志文件可以作为生产用， 从fridaJs本地日志文件产生fridaJs全局纯净日志文件, 以使得后续步骤 项目 analyze_by_graph 能看到 该日志文件 
function _genPureLog(){
local FridaLogF_local__prePure="${FridaLogF_local}--prePure"
grep __@__@   $FridaLogF_local >  $FridaLogF_local__prePure
sed 's/^__@__@//' $FridaLogF_local__prePure > $FridaLogF_global
}
#  appPath中/替换为_
_appPathAsFileName=$(echo $appPath | tr '/' '_')
#  _app2_jdk-jdk-24-0_build_home_jdk_bin_java
_nowMs=$(date +%s)
FridaLogF_local="/fridaAnlzAp/frida_js/InterceptFnSym-java.log"
FridaLogF_global="/gain/frida-out/appName--${_appPathAsFileName}/Pure-${_nowMs}.log"
_tip_msg="您认为此次日志文件可以作为生产用， 故而将此fridaLog本地日志文件[$FridaLogF_local]移动为全局日志文件[${FridaLogF_global}]， 以使得后续步骤 项目 analyze_by_graph 能看到 该日志文件  "
_do_gen=false; [[ "X"$do__from_LocalFridaJsLog_Generate_GlobalFridaJsPureLog == "Xtrue" ]] && _do_gen=true;
$_do_gen && { echo $_tip_msg;  _genPureLog ;}

