const fs = require('fs')
const path = require('path')

const log = require('./log')

module.exports = () => {

  //파라미터 파싱 / 체크
  const paramsType = {
    //input url
    '-i':(input)=>{
      const reg = /(http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?)/gi
      if(!input || !input.match(reg) || input.match(reg)[0] !== input){
        throw new Error('-i 옵션의 url 이 올바르지 않습니다. ('+input+')')
      }
      log('input url : ['+input+']');
      return input
    },
    //output path
    '-o':(pathString)=>{
      
      fs.rmSync(pathString, {recursive:true, force:true})
      const ok = fs.mkdirSync(pathString, {recursive: true})
      if(!ok){
        throw new Error('-o 디렉토리 경로가 올바르지 않습니다. ('+pathString+')')
      }

      log('output path : ['+pathString+']');

      return pathString

    },
    //config json file
    '-c':(pathString)=>{
      const configFile = fs.readFileSync(pathString, 'utf-8')
      log('config : ['+configFile+']')
      return JSON.parse(configFile)
    }
  }

  const params = process.argv

  let flag
  let flagName
  let matchCnt = 0
  let paramMap = new Map()
  for(const tempParam of params){
    if(flag){
      paramMap.set(flagName, flag(tempParam))
      flag = undefined
      matchCnt += 1
    }
    flagName = tempParam
    flag = paramsType[tempParam]
  }

  if(matchCnt < 2){
    throw new Error('파라미터가 충분하지 않습니다. ( -i 와 -o 는 필수입니다. )')
  }

  return paramMap

}