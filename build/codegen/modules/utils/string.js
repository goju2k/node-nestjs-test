module.exports = class StringUtil{

  static ins = new Map()
  static{
    
    let idx = 0
    while(idx++ < 10){
      let idx2 = 0
      let str = ''
      while(idx2++ < idx * 2){
        str += ' '
      }
      this.ins.set(idx * 2, str)
    }
  }
  static inn(num, str){
    if(this.ins.get(num)){
      return this.ins.get(num) + str
    }
    throw new Error(`pad num 이 없습니다. ${num}`)
  }

  static toUpperFirst(str){
    return str.substring(0, 1).toUpperCase() + str.substring(1)
  }

  static toLowerFirst(str){
    return str.substring(0, 1).toLowerCase() + str.substring(1)
  }

}