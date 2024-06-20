#!/bin/bash

#[描述] 应用运行前准备工作
#[使用] bash /fridaAnlzAp/frida_js/pre_appRun.sh
#[依赖] https://prgrmz07.coding.net/p/app/d/sleuthkit/git/tree/brch%2Fsleuthkit-4.12.1/disk_partition_example/readme.md 

function pre_appRun(){

local img_Hm=/app2/sleuthkit/disk_partition_example
local part_ddImg_F=${img_Hm}/256M_FAT32.dd.bs4M
local part_ddImg_comparess_F=${part_ddImg_F}.tar.gz

local Err2=2
local Err2Msg="[错误] 磁盘分区dd镜像压缩文件不存在, 错误代码[$Err2]"
[[ -f $part_ddImg_comparess_F ]] || {  echo $Err2Msg ; return $Err2 ;}

tar -xzvf $part_ddImg_comparess_F -C $img_Hm

local Err3=3
local Err3Msg="[错误] 磁盘分区dd镜像文件不存在, 错误代码[$Err3]"
[[ -f $part_ddImg_F ]] || {  echo $Err3Msg ; return $Err3 ;}

#建立恢复结果目录
mkdir -p /app2/sleuthkit/recovery_result_dir/256M_FAT32_bs4M/

local OkMsg="[成功] 获得磁盘分区dd镜像文件 [$part_ddImg_F]:"
echo $OkMsg && ls -lh $part_ddImg_F
}


pre_appRun