
/** 在启动时, 附加到C语言main函数, 添加参数列表
 * firda拦截应用的main函数并添加参数，注意只有类c编译器产生的应用才有main函数
 * 
 * 添加参数 /app/qemu/build-v8.2.2/qemu-system-x86_64 -nographic  -append "console=ttyS0"  -kernel  /bal/linux-stable/arch/x86/boot/bzImage -initrd /bal/bldLinux4RunOnBochs/initramfs-busybox-i686.cpio.tar.gz 
 * 参考 :  https://stackoverflow.com/questions/72871352/frida-spawn-a-windows-linux-process-with-command-line-arguments/72880066#72880066
 * 
 readelf --symbols /app/qemu/build/qemu-system-x86_64 | egrep "main$"
 37431: 00000000003153f0    23 FUNC    GLOBAL DEFAULT   16 main

 这种就是有main函数的

 */
 function cMainFn_addArgLs_atBoot_attach(argLsAsTxt:string):boolean{
  //若参数列表文本为空,则返回失败
  if (argLsAsTxt == null || argLsAsTxt== undefined || argLsAsTxt.length==0){
    console.log("##main参数为空")
    return false;
  }

  const mnFnPtr:NativePointer = DebugSymbol.fromName("main").address;
  //若无名为main的函数,则返回失败
  if (mnFnPtr==null || mnFnPtr==undefined){
    console.log("##无main函数,无法通过拦截main函数来添加参数,可能不是类c编译器产生的应用")
    return false;
  }
  console.log(`##收到main函数参数mnArgTxt=${argLsAsTxt}`)

  //若参数列表元素个数小于0,则返回失败
  const mnArgStrLs_raw:string[]=argLsAsTxt.split(" ")
  if(mnArgStrLs_raw.length<=0){
    return false;
  }

  //若参数列表中非空串的元素个数小于0,则返回失败
  const mnArgStrLs:string[]=mnArgStrLs_raw.filter(elm=>elm!="")
  if(mnArgStrLs.length<=0){
    return false;
  }

  //执行附加
  //  被附加的代码 此时不会被执行, 
  //  被附加的代码 在等到刚进入main函数被调用时  才会被执行 
  Interceptor.attach(mnFnPtr, {
      onEnter:function  (this: InvocationContext, args: InvocationArguments) {
        console.log(`##进入main函数`)
        // main(int argc, char** argv): args[0] == int argc, args[1] == wchar *argv[]
        const mnArgMemLs:NativePointer[]=mnArgStrLs.map(mnArgStr=>Memory.allocUtf8String(mnArgStr))
        const mnArgVect:NativePointer = Memory.alloc(mnArgMemLs.length * Process.pointerSize)
        //参数列表作为this的字段，防止被垃圾回收
        this.mnArgVect=mnArgVect;

          for (let [k,argK] of  mnArgMemLs.entries()){
            //每个参数都作为this的字段，防止被垃圾回收
            this[`mnArgMem${k}`]=argK

            mnArgVect.add(k*Process.pointerSize).writePointer(argK);
          }

  
          
          // 覆盖 main(int argc, char** argv) 中的argc 、 argv
          args[0] = ptr(mnArgMemLs.length);
          args[1] = mnArgVect;
          
      }
  });

  //若到此时无错误,则默认成功
  return true;
}