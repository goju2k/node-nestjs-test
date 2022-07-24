module.exports = class CaseUtil {
  static fromSnakeToCamel(value){
    let newValue = ''
    let nextUpper = false
    for(let ch of value){
      if(ch === '-'){
        nextUpper = true
      }else{
        if(nextUpper === true){
          newValue += ch.toUpperCase()
          nextUpper = false
        }else{
          newValue += newValue ===''?ch.toUpperCase():ch
        }
      }
    }
    return newValue
  }
}