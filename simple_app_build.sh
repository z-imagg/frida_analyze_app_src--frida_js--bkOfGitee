#!/usr/bin/env bash

#去此脚本所在目录
f=$(readlink -f ${BASH_SOURCE[0]})  ; d=$(dirname $f)
cd $d

rm -v simple_app.elf
gcc  -g1 simple_app.c -o simple_app.elf


# ldd /fridaAnlzAp/frida_js/simple_app.elf 
# 	linux-vdso.so.1 (0x00007ffff7fc1000)
# 	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007ffff7c00000)
# 	/lib64/ld-linux-x86-64.so.2 (0x00007ffff7fc3000)
