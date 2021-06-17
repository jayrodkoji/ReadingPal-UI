import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {Message} from "../../Providers/messages-controller/model/message";
import {MessagesService} from "../../Providers/messages-controller/messages.service";
import {ImageUtils} from "../../utils/image-utils";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-message-system',
  templateUrl: './message-system.component.html',
  styleUrls: ['./message-system.component.scss'],
})
export class MessageSystemComponent implements OnInit, OnChanges {
  @Input() messageData;
  @Input() viewer;
  @Input() guestImage
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
    if(this.currentQuestion) {
      let message = new Message();
      message.student_username = this.messageData.student_username;
      message.teacher_username = this.messageData.teacher_username;
      message.user_role = this.viewer;
      message.new_message = this.currentQuestion;
      message.book_id = this.messageData.book_id;
      message.annotation_id = this.messageData.annotation_id;
      message.resolved = this.viewer === 'ROLE_TEACHER';
      message.time_stamp = (Date.now() / 1000);
      message.teacher_read = this.viewer === 'ROLE_TEACHER';
      message.student_read = this.viewer === 'ROLE_STUDENT';

      this.messagesService.addMessage(message).subscribe((res) => {
        if(res) {
          this.messages.push(res);
          this.currentQuestion = '';

          this.updatedMessages.emit();
        } else {
          alert("error sending message")
        }
      })
    }
  }

  onKey(event: KeyboardEvent) {
    if(event.key === "Enter")
      this.submitQuestion();
  }

  getMessages() {
    this.messages = [];
    if(this.messageData)
      this.messagesService.getMessages(this.messageData.teacher_username, this.messageData.student_username, this.messageData.book_id)
          .subscribe((res) => {
            if(res) {
              res.forEach((message) => {
                if (message.annotation_id == this.messageData.annotation_id)
                  this.messages.push(message)
              })

              this.messages.sort((a, b) => a.time_stamp - b.time_stamp);

              if(this.messages.length > 0)
                this.hasMessages.emit();

              this.messages.forEach((msg) => {
                if(this.viewer === 'ROLE_STUDENT') {
                  if(!msg.student_read) {
                    msg.student_read = true;
                    this.messagesService.updateMessage(msg).subscribe();
                  }
                } else if (this.viewer === 'ROLE_TEACHER') {
                  if(!msg.teacher_read) {
                    msg.teacher_read = true;
                    this.messagesService.updateMessage(msg).subscribe();
                  }
                }
                })
              }
            })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.messageData.currentValue){
      this.messageData = changes.messageData.currentValue;
      this.getMessages();
    }
  }
  getImage(student_image: any) {
    return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(student_image));
  }

}
