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

