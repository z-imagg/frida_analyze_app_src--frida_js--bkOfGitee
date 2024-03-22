#!/usr/bin/env bash

# 手工备份 后 才能执行以下脚本 cp -v "/home/z/torch-repo/pytorch/torch/lib/libcaffe2.so"  "/home/z/torch-repo/pytorch/torch/lib/libcaffe2.so.origin.1711117046.backup"
#将巨大的200MB多的libcaffe2.so放到内存盘
RD=$(pwd)/ramdisk
[[ -d $RD ]] || mkdir $RD
sudo mount -t tmpfs -o size=1000M tmpfs $RD
ldd /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf 
#libcaffe2.so => /home/z/torch-repo/pytorch/torch/lib/libcaffe2.so (0x00007ffff2800000)
F=/home/z/torch-repo/pytorch/torch/lib/libcaffe2.so
OriginF="/home/z/torch-repo/pytorch/torch/lib/libcaffe2.so.origin.1711117046.backup" #此文件是手工备份的
Fbk="${F}.origin.$(date +%s)"
FramD="$RD/libcaffe2.so"
rm -fv $F
cp -v $OriginF $FramD && ln -s $FramD $F #将libcaffe2.so软链接到内存盘中的同文件

rm -v /fridaAnlzAp/frida_js/funcDebugSymbolLs.json
read -p "停在这里，辅助调试"



#临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同， 
#  参考  https://blog.csdn.net/counsellor/article/details/81543197
echo 0 | sudo tee   /proc/sys/kernel/randomize_va_space
cat  /proc/sys/kernel/randomize_va_space  #0

npx frida-compile frida-trace.ts --output frida-trace.js  && \
frida --load  /fridaAnlzAp/frida_js/frida-trace.js   --file  /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf  --output funcDebugSymbolLs.json # --pause
#调试信心中函数个数=289146


sudo umount $RD
unlink  $F  
rm -frv $RD/