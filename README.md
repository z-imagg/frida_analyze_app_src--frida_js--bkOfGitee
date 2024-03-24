来源： https://github.com/oleavr/frida-agent-example.git


###  临时关闭Linux的ASLR(地址空间随机化) ， 否则 x.so 中的函数地址 每次都不同

https://blog.csdn.net/counsellor/article/details/81543197


### frida命令bash补全脚本生成
```shell
source /app/Miniconda3-py310_22.11.1-1/bin/activate
pip install frida==16.0.7 frida-tools==12.0.4
helpTxt2bashComplete.py --progFile frida
source bash-complete--frida.sh
#frida --<tab><tab> 可获得补全
```


### 使用举例

simple_nn.elf   来自， https://gitee.com/frida_analyze_app_src/torch-cpp/blob/master/v1.0.0/readme.md


安装依赖, ```npm install```


```shell
bash -x run.sh
```


**本tag对应的修改是不需要的**

理论说明

能区分线程或单线程情形下，函数进入、函数退出日志隐含了调用栈，无须再构造调用栈

在单线程情形下，有先后次序的函数进入、函数退出日志的先后次序已经在表达函数父子调用关系了，若f1进入但未退出期间f2进入则f1调用了f2


因此 不需要再用 frida去构造调用栈

而本tag对代码的修改 就是再试图 间接 构造 调用栈


1. 记录 函数地址 对应的 调用id序列 ，
2. 在OnEnter中 获得 当前函数地址 的 调用者 这一步frida没提供 （虽然Stalker听着能用，但不可靠），做不到

由 1、2 可以 构造 出 调用栈，  但这是不需要的工作， 需要 1、2 这种 方案 的前提 是 无法区分线程的情况下

这里 把此方案 称作  不区分线程情形下的函数调用栈制造方案

frida 已经提供了 区分线程的 办法 Process.getCurrentThreadId()

因此 :  区分线程+OnEnter+OnLeave 已经 表达了 函数 调用关系 


不区分线程情形下的函数调用栈制造方案（但frida能区分线程，因此此方案是多余的、无用的）