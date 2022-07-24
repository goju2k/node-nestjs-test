import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import {HeaderStore} from 'src/common/header/header';

import {executionAsyncId, triggerAsyncId} from 'async_hooks'
import LogUtil from 'src/common/util/log';

@Injectable()
export default class MainInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    const now = performance.now();

    //로그 타이틀
    const title = `[interceptor][main][${context.getClass().name}.${context.getHandler().name}]`

    //실행 ID
    const execId = executionAsyncId()
    
    LogUtil.log(`${title}[start]`, `Exec ID : ${execId}`);

    //common header 생성
    HeaderStore.create(context.switchToHttp().getRequest())

    //next handle
    return next
      .handle()
      .pipe(

        //handle error
        catchError((err) => {

          LogUtil.error(`${title} Exception Occured!!!`)

          //common header 정리
          HeaderStore.remove(execId)

          LogUtil.log(`${title} after remove`)

          return throwError(() => err);
          
        }),

        //after process
        tap(
          () => {

            //common header 정리
            HeaderStore.remove(execId)

            LogUtil.log(`${title} after remove`)
            LogUtil.log(`${title}[e n d] ${(performance.now() - now).toFixed(1)} ms`, executionAsyncId(), triggerAsyncId())

          }
        ),

      )
  }
  
}
