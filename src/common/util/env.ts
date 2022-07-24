const prodFlag = process.env.NODE_ENV === 'production'

export default class EnvUtil {

  /**
   * 운영환경 여부
   */
  static isProduction(): boolean {
    return prodFlag
  }

}