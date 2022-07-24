class DateUtil {

  /**
   * 포맷된 현재 시간 리턴
   */
  static now(){
    const date = new Date()
    return `${date.getFullYear()}-${this.pad2(date.getMonth() + 1)}-${this.pad2(date.getDate())} ${this.pad2(date.getHours())}:${this.pad2(date.getMinutes())}:${this.pad2(date.getSeconds())} ${this.pad3(date.getMilliseconds())}`
  }

  private static pad2(num:number){
    return num < 10?'0'+num:num
  }
  private static pad3(num:number){
    return num < 10?'00'+num:num < 100?'0'+num:num
  }

}
export default DateUtil