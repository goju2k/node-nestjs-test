const fs = require('fs')
// const path = require('path')

const log = require('../log')
const CaseUtil = require('../utils/case')
const DateUtil = require('../utils/date')
const StringUtil = require('../utils/string')

const OperationInfo = require('./class.oparation')
const ModelProperty = require('./class.modelproperty')
const ConfigBuilder = require('./class.config')

const getModelImportString = (modelName)=>{
  return `import ${modelName} from '../models/${modelName}'`
}

const filterTags = (tagName, codegenConfig)=>{

  if(codegenConfig.includes
  && codegenConfig.includes.length > 0
  && !codegenConfig.includes.includes(tagName)
  ){
    return true
  }

  if(codegenConfig.excludes
  && codegenConfig.excludes.length > 0
  && codegenConfig.excludes.includes(tagName)
  ){
    return true
  }

  return false

}

module.exports = (json, paramMap) => {

  log('')
  log('=== Converter : OPENAPI (3.0.1) start !!! ==========================================')
  log('')

  //작업 통계
  let oparationCnt = 0
  let skipOperationCnt = 0
  let methodCntMap = new Map()

  const rootPath = paramMap.get('-o')

  const split = rootPath.split('/')
  const rootName = split[split.length - 1]
  const servicePath = rootPath + '/services'
  const modelPath = rootPath + '/models'

  //service 폴더 생성
  fs.mkdirSync(servicePath)
  
  //model 폴더 생성
  fs.mkdirSync(modelPath)

  //config class 생성
  const configFileName = new ConfigBuilder(rootPath, rootName, json).createFile()
  const configFileImport = `import { Remote } from '../${configFileName}'`

  //codegen config
  const codegenConfig = paramMap.get('-c') || {}
  
  //tags 로 부터 클래스 목록 생성
  const classes = new Map()
  for(const tag of json.tags){

    if(filterTags(tag.name, codegenConfig)){
      continue
    }

    classes.set(tag.name, {
      name:tag.name,
      className:CaseUtil.fromSnakeToCamel(tag.name),
      description:tag.description,
      baseImports:[`import axios from 'axios'`, 'import { Injectable } from "@nestjs/common"', configFileImport],
      imports:[],
      operations:[]
    })

  }

  //path 수 만큼 operation 처리
  let pathData
  let restData
  let fileStr
  let currTag
  let currClass
  let currOperation
  let currCnt
  for(const pathName in json.paths){

    fileStr = ''

    pathData = json.paths[pathName]

    for(const methodName in pathData){

      restData = pathData[methodName]
      
      currTag = restData.tags[0]
      if(filterTags(currTag, codegenConfig)){
        continue
      }

      if(!currTag){
        skipOperationCnt += 1
        continue
      }
      
      //대상 클래스 찾기
      currClass = classes.get(currTag)
      if(!currClass){
        skipOperationCnt += 1
        continue
      }

      //operation
      currOperation = new OperationInfo(pathName, methodName, restData)
      currClass.operations.push(currOperation.build())

      //operation - import
      let importString
      for(let im of currOperation.imports){
        importString = getModelImportString(im)
        !currClass.imports.includes(importString) && currClass.imports.push(importString)
      }

      //method count
      currCnt = methodCntMap.get(methodName) || 0
      methodCntMap.set(methodName, currCnt + 1)

    }

  }

  //service 에서 사용중인 model 모으기
  const usedModels = new Set()
  classes.forEach((val, key)=>{

    //import
    for(let temp of val.imports){
      usedModels.add(temp)
    }
    
  })

  //모델 파일 생성
  const {schemas} = json.components
  
  if(schemas){

    let schemaInfo
    let propertyInfo
    //model property 정보 구성 (model 에서 사용중인 import 정보 모으기)
    for(const modelName in schemas){
      
      schemaInfo = schemas[modelName]
      
      //property type
      let tempModelProperty
      for(let propertyName in schemaInfo.properties){

        propertyInfo = schemaInfo.properties[propertyName]
        propertyInfo.name = propertyName
        tempModelProperty = new ModelProperty(propertyInfo, schemaInfo.required)

        for(let im of tempModelProperty.imports){
          usedModels.add(getModelImportString(im))
        }

      }

    }

    let modelImportString
    for(const modelName in schemas){

      modelImportString = getModelImportString(modelName)

      if(!usedModels.has(modelImportString)) continue

      schemaInfo = schemas[modelName]
      schemaInfo.imports = []

      let str = '\n/**\n'
      + '*\n'
      + '* Generated by Rsquare Codegen (v'+json.openapi+') ('+DateUtil.now()+')\n'
      + '*\n'
      + '*/\n'

      //property type
      const propertyTypes = []
      let tempModelProperty
      for(let propertyName in schemaInfo.properties){
        propertyInfo = schemaInfo.properties[propertyName]
        propertyInfo.name = propertyName
        tempModelProperty = new ModelProperty(propertyInfo, schemaInfo.required)

        for(let im of tempModelProperty.imports){
          !schemaInfo.imports.includes(im) && schemaInfo.imports.push(im)
        }

        propertyTypes.push(tempModelProperty)
      }

      //import
      for(let temp of schemaInfo.imports){
        str += `import ${temp} from './${temp}'\n`
      }
      
      str += '\n'

      //interface start
      str += `export default interface ${modelName} {\n\n`

      //property
      propertyTypes.sort((a, b) => { //이름으로 정렬
        return a.name > b.name?1:-1
      })
      for(let propertyType of propertyTypes){
        str += StringUtil.inn(2, `${propertyType.name}${(propertyType.required?'':'?')}: ${propertyType}\n`)
      }

      //end
      str += '\n}\n'

      fs.writeFileSync(
        modelPath + '/' + modelName + '.ts',
        str, 
        {encoding:'utf-8'}
      )

    }

  }

  //클래스 파일 생성
  const serviceNames = []
  classes.forEach((val, key)=>{

    let str = '\n/**\n'
    + '*\n'
    + '* Generated by Rsquare Codegen (v'+json.openapi+') ('+DateUtil.now()+')\n'
    + '*\n'
    + `* ${val.description || ''}\n`
    + '*\n'
    + '*/\n\n\n'

    //base import
    for(let temp of val.baseImports){
      str += temp + '\n'
    }

    str += '\n'

    //import
    for(let temp of val.imports){
      str += temp + '\n'
    }
    
    str += '\n'

    //description
    str += `/**\n`
    str += `* @description ${val.description || ''}\n`
    str += `*/\n`

    //Injectable
    str += '@Injectable()\n'

    const serviceClassName = val.className.endsWith('Controller')?val.className.replace('Controller', 'Service'):val.className+'Service'

    //class start
    str += `export default class ${serviceClassName} {\n\n`

    //operations
    for(let temp of val.operations){
      oparationCnt += 1
      str += temp + '\n'
    }

    //end
    str += '}\n'

    serviceNames.push(serviceClassName)

    fs.writeFileSync(
      servicePath + '/' + serviceClassName + '.ts',
      str, 
      {encoding:'utf-8'}
    )

  })

  //모듈 파일 생성
  let str = '\n/**\n'
  + '*\n'
  + '* Generated by Rsquare Codegen (v'+json.openapi+') ('+DateUtil.now()+')\n'
  + '*\n'
  + `* ${rootName} NestJS Module\n`
  + '*\n'
  + '*/\n\n\n'

  //base import
  str += `import { Module } from '@nestjs/common'\n`

  str += '\n'

  //service import
  for(let temp of serviceNames){
    str += `import ${temp} from './services/${temp}'\n`
  }

  //Module start
  str += '@Module({\n'

  //providers & exports
  const joinedServices = serviceNames.join(', ')
  str += StringUtil.inn(2, `providers: [${joinedServices}],\n`)
  str += StringUtil.inn(2, `exports: [${joinedServices}]\n`)

  //Module end
  str += `})\n`

  //export
  str += `export class ${StringUtil.toUpperFirst(rootName)}ApiModule {}\n`

  fs.writeFileSync(
    rootPath + '/' + rootName + '.module.ts',
    str, 
    {encoding:'utf-8'}
  )

  log(`created ${classes.size} classes`)
  methodCntMap.forEach((cnt, methodName)=>{
    log(`request ${methodName} ${cnt}`)  
  })
  log(`total ${oparationCnt} operations`)
  log(`skipped ${skipOperationCnt} oparations`)
  log('')
  log(`=== Converter : OPENAPI (3.0.1) e n d !!! ==========================================`)
  log('')

}