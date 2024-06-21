
## 术语

- [术语] : MG_ == Module Global Type == 模块中定义的全局类型 且 只在该模块中使用 == 模块局类型

- [术语] : mg_ == Module Global var  == 模块中定义的全局变量 且 只在该模块中使用 == 模块局变量

- [术语] : _g_x == global var x 作为局部变量  == 比如 `函数调用f1(g_x)` 对应的 `函数签名f1(_g_x:Type)`

- [术语] : _x == 该处的局部变量x



## frida命令只允许目标应用携带非中划线参数


frida只允许应用携带非中划线参数 , 

若目标应用需要携带中划线参数 则 必须在 x.ts 中 该应用解析应用参数前 修改应用参数

### frida命令 举例 


- `frida --load x.ts --file app.elf app_arg1 app_arg2` 合法的 目标应用及其参数

- `frida --load x.ts --file app.elf -app_option1 app_value1` 不合法的 目标应用及其参数
   因为 `-app_option1` 会被当成是 `frida命令` 的参数, 而不是`应用app.elf`的参数


### 应用们

#### sleuthkit-4.12.1 

对一个 [32M_FAT dd磁盘镜像](https://prgrmz07.coding.net/p/app/d/sleuthkit/git/tree/clang-var-modify%2Fsleuthkit-4.12.1%2FF/disk_partition_example/32M_FAT.dd.bs4M.tar.gz) 做数据恢复 , 正常运行，获得被恢复的文件

[clang-var-modify/sleuthkit-4.12.1/F](https://prgrmz07.coding.net/p/app/d/sleuthkit/git/tree/clang-var-modify%2Fsleuthkit-4.12.1%2FF) ,  [6c9bada97f355813ba11c7b56856d61597f06b46](https://prgrmz07.coding.net/p/app/d/sleuthkit/git/commit/6c9bada97f355813ba11c7b56856d61597f06b46)


```shell
cd /fridaAnlzAp/frida_js/
bash fridaJs_runApp.sh 
#Files Recovered: 4

```

获得145万条函数进出日志
```shell
wc -l        /fridaAnlzAp/frida_js/InterceptFnSym-tsk_recover.log
# 1458564 /fridaAnlzAp/frida_js/InterceptFnSym-tsk_recover.log


```