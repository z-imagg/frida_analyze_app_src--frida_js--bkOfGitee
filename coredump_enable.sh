#!/bin/bash

###  临时启用coredump, （崩溃时生成coredump文件 以 协助调查问题）
### [使用] , 必须要source执行 否则 ulimit不生效
###   source /fridaAnlzAp/frida_js/coredump_enable.sh

function _coredump_enable()  {
#关闭崩溃报告传递服务apport
sudo systemctl stop apport
sudo systemctl stop disable || true

#临时允许coredump
ulimit -c unlimited
}


#调用 函数 _coredump_enable 以允许 coredump
_coredump_enable