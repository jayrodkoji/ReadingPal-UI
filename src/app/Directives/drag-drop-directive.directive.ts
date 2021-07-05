import {Directive, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirectiveDirective {
  @Output() fileDropped: EventEmitter<any> = new EventEmitter();
  @Output() dragedOverEv: EventEmitter<any> = new EventEmitter<any>();
  @Output() dragedLeaveEv: EventEmitter<any> = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) dragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragedOverEv.emit();
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) public dragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragedLeaveEv.emit();
  }

  // Drop listener
  @HostListener('drop', ['$event']) public dropped(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.dragedLeaveEv.emit();
      this.fileDropped.emit(files);
    }
  }

}
