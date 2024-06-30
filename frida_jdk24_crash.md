# gdb 加载 frida执行java崩溃的coredump 卡住, 因缺少fd/34

frida对 jdk/bin/java 植入了一些 文件描述符, 而 coredump 文件中 不知道这些 文件描述符(比如fd/34) 如何创建的 , 因此 gdb 加载 coredump 卡住了 

```shell
gdb /app2/jdk-jdk-24-0/build_home/jdk/bin/java /fridaAnlzAp/frida_js/core.786190

# Reading symbols from /app2/jdk-jdk-24-0/build_home/jdk/bin/java...
# Reading symbols from /app2/jdk-jdk-24-0/build_home/jdk/bin/java.debuginfo...
# warning: Can't open file /tmp/hsperfdata_z/786190 (deleted) during file-backed mapping note processing
# warning: Can't open file /memfd:frida-agent-64.so (deleted) during file-backed mapping note processing
```

```shell
sudo strace -p   `pidof gdb`
# strace: Process 2505 attached
# read(34, 

```

```shell
 ls -lh /proc/`pidof gdb`/fd/34
# lr-x------ 1 z z 64  6月 30 15:27 /proc/2505/fd/34 -> 'pipe:[32969]'

FridaSoF=/app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida/_frida.abi3.so
sudo exec 34<$FridaSoF

```


```shell
file /app/Miniconda3-py310_22.11.1-1/lib/python3.10/site-packages/frida/_frida.abi3.so

```