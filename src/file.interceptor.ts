import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as multer from 'multer';
import { extname } from 'path';

@Injectable()
export class FileInterceptor implements NestInterceptor {
  constructor(private readonly fieldName: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const multerOptions = {
      storage: multer.diskStorage({
        destination: './uploads', // Specify your upload directory
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    };

    return new Observable((observer) => {
      const multerMiddleware = multer(multerOptions).single(this.fieldName);
      multerMiddleware(request, null, async (error) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(true);
          observer.complete();
        }
      });
    }).pipe(
      switchMap(() => next.handle()), // Return the Observable from next.handle()
    );
  }
}
