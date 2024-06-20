// [依赖] : 无

function baseNameOfFilePath(filePath:string):string{
  // const filePath = '/app/xx/yy.elf';
const parts = filePath.split('/');
const baseName = parts[parts.length - 1];
// baseName == 'yy.elf'

// console.log(baseName); 
return baseName;
}
function nowTxt(){
  const now:Date=new Date();
  
  //时区没生效，暂时忽略
  const localNowTxt=now.toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai', })

  const txt=`${now.getTime()},${localNowTxt}`
  return txt
}
function isNil(x:any):boolean{
  const empty=(x == undefined || x==null);
  return empty;
}

type FnAdrHex=string;
function adrToHex(fnAdr:NativePointer):FnAdrHex{
  return fnAdr.toString(16);
}

