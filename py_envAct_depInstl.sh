#!/bin/bash

#[描述] 激活py环境 、 py依赖安装

cd /fridaAnlzAp/frida_js/

# 激活py环境
# set +x ; 
source /app/Miniconda3-py310_22.11.1-1/bin/activate ; 
# set -x
 #请确认是 miniconda中的pip
[[ "$(sudo PATH=$PATH  which pip)" == "/app/Miniconda3-py310_22.11.1-1/bin/pip" ]] || exit 11
 #请确认是 miniconda中的python
[[ "$(sudo PATH=$PATH  which python)" == "/app/Miniconda3-py310_22.11.1-1/bin/python" ]] || exit 12
sudo PATH=$PATH python -m pip install --upgrade pip #升级pip
sudo PATH=$PATH pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple > /dev/null
# py依赖安装
sudo PATH=$PATH pip install -r requirements.txt 

