// [依赖] : 无
// [术语] : MG_ 、 mg_ 见 readme.md

type MG_AbsThrdId=string;
//时刻
type MG_TmPntVal=number;
class MG_TimePoint {
  static initTmPntVal(processId:number,thrdId:ThreadId){
    return new MG_TimePoint(processId,thrdId,0)
  }
  //进程id
  processId:number
  //线程id
  thrdId:ThreadId
  //进程_线程　对应的　最新时刻值
  curTmPnt:MG_TmPntVal
  constructor (processId:number,thrdId:ThreadId,tmPnt:MG_TmPntVal) {
    this.processId = processId
    this.thrdId = thrdId
    this.curTmPnt = tmPnt
  }

  nextVal():MG_TmPntVal{
    ++this.curTmPnt
    return this.curTmPnt
  }
  toJson(){
    return JSON.stringify(this)  
  }
}

//线程绝对id
function toAbsThrdId(processId:number, thrdId:ThreadId):MG_AbsThrdId{
  const _absThrdId:MG_AbsThrdId=`${processId}_${thrdId}`;
  return _absThrdId
}

//填充时刻表格
function nextTmPnt(processId:number, thrdId:ThreadId):MG_TmPntVal{
  const absThrdId:MG_AbsThrdId=toAbsThrdId(processId,thrdId)
  let tmPnt:MG_TimePoint|undefined=g_TmPntTb.get(absThrdId);
  if(tmPnt){ // !isNil(tmPnt)
    // console.log(`##从缓存获得时刻tmPnt，　${absThrdId}:${JSON.stringify(tmPnt)}`);
    return tmPnt.nextVal();
  }

  tmPnt=MG_TimePoint.initTmPntVal(processId,thrdId)
  g_TmPntTb.set(absThrdId, tmPnt);

  console.log(`##只有首次新建对象tmPnt，${JSON.stringify(tmPnt)}`);

  return tmPnt.nextVal()

}

