// [依赖] : 无

type G_AbsThrdId=string;
//时刻
type G_TmPntVal=number;
class G_TimePoint {
  static initTmPntVal(processId:number,thrdId:ThreadId){
    return new G_TimePoint(processId,thrdId,0)
  }
  //进程id
  processId:number
  //线程id
  thrdId:ThreadId
  //进程_线程　对应的　最新时刻值
  curTmPnt:G_TmPntVal
  constructor (processId:number,thrdId:ThreadId,tmPnt:G_TmPntVal) {
    this.processId = processId
    this.thrdId = thrdId
    this.curTmPnt = tmPnt
  }

  nextVal():G_TmPntVal{
    ++this.curTmPnt
    return this.curTmPnt
  }
  toJson(){
    return JSON.stringify(this)  
  }
}

