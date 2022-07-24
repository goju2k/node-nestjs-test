/**
 * RSQUARE Codegen v1.0
 * For Nestjs Module
 */
const fs = require('fs')
const path = require('path')

const log = require('./modules/log')
const init = require('./modules/init')

const axios = require('axios')

let start = performance.now()

log('')
log('R Codegen 시작')
log('')

//init
const paramMap = init()

//파일 읽기
// const srcFile = fs.readFileSync(path.resolve(__dirname, './rfind.json'), 'utf-8')
// const data = JSON.parse(srcFile)

//remote 읽기
axios.get(paramMap.get('-i')).then(({data})=>{
  
  //변환
  const version = data.openapi || data.swagger
  const type = data.openapi ? 'OPENAPI' : data.swagger ? 'SWAGGER' : 'UNKNOWN'
  
  let converter
  try{
  
    log('OPENAPI '+version)
    converter = require('./modules/convert'+version)
  
  }catch(e){}
  
  if(!converter){
    throw new Error(`${type} ${version} 에 대한 Converter 가 존재하지 않습니다.`)
  }
  
  converter(data, paramMap)
  
  log('R Codegen 완료',(performance.now() - start).toFixed(1)+' ms');
  log('')

})