import {Directive, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirectiveDirective {
  @Output() onFileDropped: EventEmitter<any> = new EventEmitter();
  @Output() onDragOverEv: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDragLeaveEv: EventEmitter<any> = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDragOverEv.emit();
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.onDragLeaveEv.emit();
  }

  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.onDragLeaveEv.emit();
      this.onFileDropped.emit(files);
    }
  }

}
