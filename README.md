来源： https://github.com/oleavr/frida-agent-example.git

安装依赖，```npm install```

将ts编译为js, ```npx frida-compile frida-trace.ts --output frida-trace.js``` 也可以用调用写在package.json中的build代词 ```npm run build```


frida的ts编译为js专用编译器为frida-compile, ```npx frida-compile --help```
```txt
Usage: frida-compile [options] <module>

Options:
  -o, --output <file>   write output to <file>
  -w, --watch           watch for changes and recompile
  -S, --no-source-maps  omit source-maps
  -c, --compress        compress using terser
  -h, --help            display help for command

```


frida命令bash补全脚本生成
```shell
source /app/Miniconda3-py310_22.11.1-1/bin/activate
pip install frida==16.0.7 frida-tools==12.0.4
helpTxt2bashComplete.py --progFile frida
source bash-complete--frida.sh
#frida --<tab><tab> 可获得补全
```


### 使用举例
```shell

#安装依赖
npm install

#用frida-compile将ts编译为js
npx frida-compile frida-trace.ts --output frida-trace.js
#npm run build #也可以用调用写在package.json中的build代词 

#frida载入此脚本frida-trace.js例子命令
frida --load  /fridaAnlzAp/frida_js/frida-trace.js   --file  /fridaAnlzAp/torch-cpp/v1.0.0/simple_nn.elf  #若要进frida的js命令行，再加选项  --debug --pause

```

输入如下， x.constructor.name获得的类型名字都是无意义的Array， 为什么输出这么少？只有这么少的函数调用？
```txt
eventLsTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
eventTypeName=Array
```