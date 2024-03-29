import { Injectable } from '@angular/core';

declare let toastr: any;

@Injectable()
export class ToasterService {
    success(message: string, title?: string) {
        return toastr.success(message, title);
    }
    info(message: string, title?: string) {
        return toastr.info(message, title);
    }
    warning(message: string, title?: string) {
        return toastr.warning(message, title);
    }
    error(message: string, title?: string) {
        return toastr.error(message, title);
    }
}
