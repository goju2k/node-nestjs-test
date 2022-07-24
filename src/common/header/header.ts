
import {createHook, executionAsyncId} from 'async_hooks'
import { Request } from 'express';
import { stdout } from 'process';
import LogUtil from 'src/common/util/log';
const fs = require('fs')

//common header
export interface Header{
  token:string //인증 토큰
}

//루트 실행ID 별 common header 저장 Map
const execIdToHeaderMap = new Map<number, Header>()

//class : stack item
class ExecCallStackItem {
  private value:number
  private prevVal:number
  private nextVal:Set<number> = new Set()

  constructor(val:number, prevVal?:number){
    this.value = val
    this.prevVal = prevVal
  }

  val(){
    return this.value
  }
  prev(){
    return this.prevVal
  }
  next(){
    return this.nextVal
  }
  addNext(val:number){
    this.nextVal.add(val)
    return this
  }
  removeNext(val:number){
    this.nextVal.delete(val)
    return this
  }
}

//class : stack
class ExecCallStack {
  map:Map<number, ExecCallStackItem> = new Map()
  add(target:number, trigger?:number){
    let execStack = this.map.get(target)
    if(!execStack){
      execStack = new ExecCallStackItem(target, trigger)
      this.map.set(target, execStack)
    }
  }
  linkNext(target:number, next:number){
    this.map.get(target)?.addNext(next)
  }
  get(target:number){
    return this.map.get(target)
  }
  has(target:number){
    return this.map.has(target)
  }
  getOrigin(target:number):ExecCallStackItem {
    let item = this.map.get(target)
    if(item){
      if(item.prev()){
        return this.getOrigin(item.prev())
      }else{
        return item
      }
    }
    throw new Error(`target ${target} 에 대한 origin 을 찾을 수 없습니다.`)
  }
  removeAll(target:number){
    let item = this.map.get(target)
    if(item){
      let next = item.next()
      next.forEach((elem)=>{
        this.removeAll(elem)
      })
      this.map.delete(target)
    }
  }
  printStack(target:number){
    const elem = this.map.get(target)
    if(elem){
      elem.next().forEach((val)=>{
        LogUtil.log('[HeaderStore][print]', `${target} => ${val}`)
      })
      elem.next().forEach((val)=>{
        this.printStack(val)
      })
    }
  }
}

//global stack store
const stack = new ExecCallStack()

//header handler
export const HeaderStore = {

  //현재 실행ID 기준으로 header 생성
  create(req:Request){

    //common header
    const header = {
      token: req.headers?.authorization
    } as Header

    //현재 실행ID
    const execId = executionAsyncId()

    LogUtil.log('[HeaderStore][create]', execId)

    //header map set
    execIdToHeaderMap.set(execId, header)

    //stack info add
    stack.add(execId)

  },

  //현재 실행ID 기준으로 global stack 및 header 정보 삭제
  remove(execId:number){
    stack.removeAll(execId)
    execIdToHeaderMap.delete(execId)
  },

  //입력받은 실행ID 기준으로 관련 스택정보 print
  printCurrStack(execId){
    LogUtil.log(`[HeaderStore][print] from ${execId} , stack size => ${stack.map.size}`)
    stack.printStack(execId)
  }

}

//common header getter
export const getHeader = () => {

  //현재 실행ID
  const execId = executionAsyncId()

  //global stack 정보로 부터 root 실행ID 구하기
  const originId = stack.getOrigin(execId).val()

  LogUtil.log('[HeaderStore][get]', execId, 'origin:'+originId)

  //root 실행ID 에 대한 header 정보 get
  return execIdToHeaderMap.get(originId)

}

// =======================================================================
// 아래부터는 nodejs 의 async_hooks 설정
// =======================================================================
// =======================================================================
// The following are the callbacks that can be passed to createHook().
// =======================================================================

// init() is called during object construction. The resource may not have
// completed construction when this callback runs. Therefore, all fields of the
// resource referenced by "asyncId" may not have been populated.
function init(asyncId, type, triggerAsyncId, resource) {

  //global stack 정보에 trigger 정보가 존재하면 stack 정보 추가 / 연결
  if(stack.has(triggerAsyncId)){
    stack.add(asyncId, triggerAsyncId)
    stack.linkNext(triggerAsyncId, asyncId)
    //log(asyncId, type, triggerAsyncId, resource, executionAsyncId())
  }
}

const asyncHook = createHook({ init });

// Allow callbacks of this AsyncHook instance to call. This is not an implicit
// action after running the constructor, and must be explicitly run to begin
// executing callbacks.
asyncHook.enable(); // async hook 동작

//async hook 용 log function
//*** console.log 로 찍게되면 async hook 에 의해 계속 호출될 가능성이 있으므로
//    fs 를 이용하여 stdout 에 찍어준다. ***
function log(asyncId, type, triggerAsyncId, resource, eid){
  let str = `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid} `
  try{
    return fs.writeSync(stdout.fd, str + JSON.stringify(resource) + '\n')
  }catch(e){

  }
  return fs.writeSync(stdout.fd, str + resource + '\n')
}
