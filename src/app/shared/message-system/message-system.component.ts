import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {Message} from '../../Providers/messages-controller/model/message';
import {MessagesService} from '../../Providers/messages-controller/messages.service';
import {ImageUtils} from '../../utils/image-utils';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-message-system',
  templateUrl: './message-system.component.html',
  styleUrls: ['./message-system.component.scss'],
})
export class MessageSystemComponent implements OnInit, OnChanges {
  @Input() messageData;
  @Input() viewer;
  @Input() guestImage;
  @Output() updatedMessages = new EventEmitter<string>();
  @Output() hasMessages = new EventEmitter<string>();

  messages: Message[];
  currentQuestion: any;

  constructor(
      private messagesService: MessagesService,
      private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }

  /**
   * Save question to DB.
   */
  submitQuestion() {
    if (this.currentQuestion) {
      const message = new Message();
      message.studentUsername = this.messageData.student_username;
      message.teacherUsername = this.messageData.teacher_username;
      message.userRole = this.viewer;
      message.newMessage = this.currentQuestion;
      message.bookId = this.messageData.book_id;
      message.annotationId = this.messageData.annotation_id;
      message.resolved = this.viewer === 'ROLE_TEACHER';
      message.timeStamp = (Date.now() / 1000);
      message.teacherRead = this.viewer === 'ROLE_TEACHER';
      message.studentRead = this.viewer === 'ROLE_STUDENT';

      this.messagesService.addMessage(message).subscribe((res) => {
        if (res) {
          this.messages.push(res);
          this.currentQuestion = '';

          this.updatedMessages.emit();
        } else {
          alert('error sending message');
        }
      });
    }
  }

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submitQuestion();
    }
  }

  getMessages() {
    this.messages = [];
    if (this.messageData) {
      this.messagesService.getMessages(this.messageData.teacher_username, this.messageData.student_username, this.messageData.book_id)
          .subscribe((res) => {
            if (res) {
              res.forEach((message) => {
                if (message.annotation_id === this.messageData.annotation_id) {
                  this.messages.push(message);
                }
              });

              this.messages.sort((a, b) => a.timeStamp - b.timeStamp);

              if (this.messages.length > 0) {
                this.hasMessages.emit();
              }

              this.messages.forEach((msg) => {
                if (this.viewer === 'ROLE_STUDENT') {
                  if (!msg.studentRead) {
                    msg.studentRead = true;
                    this.messagesService.updateMessage(msg).subscribe();
                  }
                } else if (this.viewer === 'ROLE_TEACHER') {
                  if (!msg.teacherRead) {
                    msg.teacherRead = true;
                    this.messagesService.updateMessage(msg).subscribe();
                  }
                }
                });
              }
            });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.messageData.currentValue){
      this.messageData = changes.messageData.currentValue;
      this.getMessages();
    }
  }
  getImage(studentImage: any) {
    return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(studentImage));
  }

}
