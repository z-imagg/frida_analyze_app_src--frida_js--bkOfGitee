// [依赖] : 无

//判断两个函数地址值 是否相同
function adrEq(adr1:NativePointer, adr2:NativePointer){
  if(adr1==adr2){
    return true;
  }
  const adr1Null:boolean=  isNil(adr1)
  const adr2Null:boolean=  isNil(adr2)
  if( adr1Null || adr2Null){
    return false;
  }

  const adr1Hex:FnAdrHex=adrToHex(adr1);//adr1.toInt32()?
  const adr2Hex:FnAdrHex=adrToHex(adr2);//adr2.toInt32()?

  const eq:boolean= (adr1Hex == adr2Hex);
  return eq;
}
