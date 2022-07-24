const typeMap = require('./map.types')

module.exports = class ModelProperty {
  
  name
  required
  propertyInfo

  imports = []

  str = ''

  constructor(propertyInfo, requiredList){
    this.name = propertyInfo.name
    this.required = requiredList && requiredList.includes(propertyInfo.name)
    this.propertyInfo = propertyInfo
    this.build(propertyInfo)
  }

  build(param){

    if(!param.type && param.$ref){
      param.type = 'object'
    }

    let typeStr = typeMap.get(param.type)
    if(typeStr === undefined){
      throw new Error(`property type (${param.type}) 은 지원하지 않습니다.`)
    }

    if(param.type === 'array' || param.type === 'object'){
      const subInfo = {schema:param, str:typeStr}
      this.buildSubType(subInfo)
      this.str += subInfo.str
    }else{
      this.str += typeStr
    }

  }

  buildSubType(info){

    const {schema} = info
    const {items, additionalProperties} = schema

    let target = items || additionalProperties || schema

    if(!target.type && !target.$ref) {
      throw new Error(`Subtype 의 $ref 또는 type 항목은 필수입니다.`)
    }
    
    let out
    if(target.$ref){

      const split = target.$ref.split('/')
      out = split[split.length - 1]
      info.str = out + info.str

      !this.imports.includes(out) && this.imports.push(out)

    }else if(target.type){
      
      out = typeMap.get(target.type)
      
      if(target.type === 'array' || target.type === 'object'){

        info.str = out + info.str
        info.schema = target
        this.buildSubType(info)
        
      }else if(out !== undefined){
        info.str = out + info.str
      }

    }else{
      throw new Error('array 타입의 property items 는 $ref 또는 type 항목이 필수입니다.')
    }

    return info

  }

  toString(){
    return this.str
  }

}
