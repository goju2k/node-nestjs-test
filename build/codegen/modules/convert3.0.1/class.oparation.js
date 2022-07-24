const StringUtil = require('../utils/string')
const ParamProperty = require('./class.paramproperty')

module.exports = class OperationInfo {
  
  methodName
  pathName
  operationData

  summary
  operationId
  parameters
  requestBody

  buildStingValue = ''
  
  imports = []

  bodyImportString = ''
  
  constructor(pathName, methodName, operationData){
    
    Object.defineProperty(this, 'buildString', {
      get(){
        if(this.buildStingValue === '') throw new Error('아직 build 를 하지 않았습니다.')
        return this.buildStingValue
      },
      set(val){
        this.buildStingValue = val
      }
    });

    this.pathName = pathName
    this.methodName = methodName
    this.operationData = operationData

    this.summary = operationData.summary
    this.operationId = operationData.operationId
    this.parameters = operationData.parameters
    this.requestBody = operationData.requestBody

    this.responseContent = operationData.responses['200'].content

  }

  convertParameter(){

    let str = ''
    if(this.parameters){

      let typeStr
      this.parameters.sort((a, b)=>a.required < b.required?1:-1)
      for(const param of this.parameters){
  
        typeStr = new ParamProperty(param)
        
        for(let im of typeStr.imports){
          !this.imports.includes(im) && this.imports.push(im)
        }
  
        str += `${(str !== ''?', ':'')}${param.name}${(param.required?'':'?')}: ${typeStr}`
  
      }

    }else if(this.requestBody){
      
      const {content} = this.requestBody
      if(!content) throw new Error(`requestBody 에 content 가 없습니다.`)

      let typeStr
      for(const dataType in content){

        typeStr = new ParamProperty(content[dataType], true)
        
        for(let im of typeStr.imports){
          !this.imports.includes(im) && this.imports.push(im)
        }

        let name = typeStr.toString()
        str += `${(str !== ''?', ':'')}${StringUtil.toLowerFirst(name)}: ${name}`

      }

    }

    return str
    
  }

  convertAxiosParameter(){
    
    if(!this.parameters) return ''

    const params = []
    for(const param of this.parameters){
      params.push(param.name)
    }
    return params.join(', ')

  }

  convertAxiosRequestBody(){
    
    if(!this.requestBody) return '{}'

    const {content} = this.requestBody
    if(!content) throw new Error(`requestBody 에 content 가 없습니다.`)

    let typeStr
    for(const dataType in content){

      typeStr = new ParamProperty(content[dataType], true)

      let name = typeStr.toString()
      return StringUtil.toLowerFirst(name)

    }

  }

  convertResponse(){

    if(!this.responseContent) return 'void'

    const content = this.responseContent

    let typeStr
    for(const dataType in content){

      typeStr = new ParamProperty(content[dataType], true)
      
      for(let im of typeStr.imports){
        !this.imports.includes(im) && this.imports.push(im)
      }

      return typeStr.toString()

    }

    throw new Error('response content 의 처리가 불가합니다.')

  }

  build(){

    let str = ''

    //Response 타입
    const responseType = this.convertResponse()

    //Parameters
    const parameterString = this.convertParameter()

    //axios params
    const axiosParamString = this.convertAxiosParameter()

    //axios body
    const axiosBodyData = this.convertAxiosRequestBody()

    //summary
    str += StringUtil.inn(2, `/**\n`)
    str += StringUtil.inn(2, `* @summary ${this.summary || ''}\n`)
    str += StringUtil.inn(2, `*/\n`)
    
    //선언부
    str += StringUtil.inn(2, `async ${this.operationId} (${parameterString}): Promise<${responseType}> {\n`)

    //axios api 호출
    let returnVar = 'null'
    let callStr;
    if(this.methodName === 'get'){
      callStr = StringUtil.inn(4, `const data = await axios.get(Remote + '${this.pathName}', {params:{${axiosParamString}}}) as ${responseType}\n`)
      returnVar = 'data'
    }else if(this.methodName === 'put' || this.methodName === 'post' || this.methodName === 'delete' || this.methodName === 'patch'){
      callStr = StringUtil.inn(4, `const data = await axios.${this.methodName}(Remote + '${this.pathName}', ${axiosBodyData}) as ${responseType}\n`)
      returnVar = 'data'
    }else{
      throw new Error(`${this.methodName} 는 지원되지 않는 메소드입니다.`)
    }

    str += callStr
    
    //리턴
    str += StringUtil.inn(4, `return new Promise<${responseType}>((resolve)=>{resolve(${returnVar})})\n`)

    //종료
    str += StringUtil.inn(2, `}\n`)

    this.buildString = str

    return this

  }

  toString(){
    return this.buildString
  }

}
