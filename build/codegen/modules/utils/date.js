module.exports = class DateUtil {
  
  static now(){
    const date = new Date()
    return `${date.getFullYear()}-${this.pad2(date.getMonth() + 1)}-${this.pad2(date.getDate())} ${this.pad2(date.getHours())}:${this.pad2(date.getMinutes())}:${this.pad2(date.getSeconds())} ${date.getMilliseconds()}`
  }

  static pad2(num){
    return num < 10?'0'+num:num
  }

}