
// [依赖] : 无

function get_now_ms():number{
  const now_dt:Date=new Date()
  const abs_ms:number=now_dt.getTime()
  return abs_ms
}
