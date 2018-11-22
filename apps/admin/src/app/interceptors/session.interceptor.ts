import { Injectable } from '@angular/core'

import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpHeaderResponse,
  HttpErrorResponse
} from '@angular/common/http'

import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators';


@Injectable()


export class SessionInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        (event: HttpResponse<any>) => {
          if (this.isLogin(event)){
            // console.log(event)
            // console.log(event.headers.keys())
          }
        },
        error => {}
      )
    )
  }

  isLogin(event) {
    var
      response = event instanceof HttpResponse,
      loginAttempt = event.url ? event.url.match(/user\/login$/) : false,
      success = event.body && event.body.code == 200

    return response && loginAttempt && success
  }
}