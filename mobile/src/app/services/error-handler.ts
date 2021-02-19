import { HttpErrorResponse } from '@angular/common/http';
import { throwError} from 'rxjs';

export function errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      // Server error
        console.error(`Error ${error.status}: ${error.error?.detail}`);
    }
    return throwError(error);
  }
