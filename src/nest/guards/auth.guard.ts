import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import LogUtil from 'src/common/util/log';

export default class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const {headers, url} = context.switchToHttp().getRequest();

    if(headers){

      //인증토큰 체크
      let token = headers.authorization
      if(token && token.length > 3) return true //임시로 4글자 이상의 토큰일때만 유효

    }
    
    LogUtil.log('[AuthGuard]',`path (${url}) not authorized !!!`)
    return false;

  }
}
