
// [依赖] : _DateTime_util.ts, g_tsBeginDtMs ;  g_appName


const mg_logFPath:string=`./InterceptFnSym-${g_appName}-${g_tsBeginDtMs}.log`
const mg_logF:File=new File(mg_logFPath,"w");

function logWriteLn(txt:string):void{
  const lineTxt:string=`${txt}\n`
  mg_logF.write(lineTxt)
}