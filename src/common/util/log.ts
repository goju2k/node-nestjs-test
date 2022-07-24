import DateUtil from "./date"
import EnvUtil from './env'

const dev = !EnvUtil.isProduction()

class LogUtil{
  static log(...args){
    dev && console.log(`[${DateUtil.now()}]`, ...args)
  }
  static error(...args){
    console.error(`[${DateUtil.now()}]`, ...args)
  }
}
export default LogUtil