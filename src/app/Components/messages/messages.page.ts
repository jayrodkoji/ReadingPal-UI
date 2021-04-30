import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {MessagesService} from "../../Providers/messages-controller/messages.service";
import {Message} from "../../Providers/messages-controller/model/message";
import {ReaderMetaService} from "../../Providers/reader-meta/reader-meta.service";
import {GetBooksService} from "../../Providers/books/get-books.service";
import {ImageUtils} from "../../rp-utils/image-utils";
import {DomSanitizer} from "@angular/platform-browser";
import {UsersService} from "../../Providers/user-controller/users.service";

@Component({
    selector: 'app-messages',
    templateUrl: './messages.page.html',
    styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
    allMessages: Message[];
    messages: Message[];
    filteredMessages: Message[];
    currentUserRole: any;
    currentUserRead: any;
    groupedObject: any;
    guestImage = new Map<string, string>();
    bookInfo = new Map<string, any>();
    annotations = new Map<string, any>();
    currentMessage: Message;
    annotation: any;
    lesson: any;
    book: any;
    filter: string;
    searchFilter: string = '@username';
    searchText: any = '';

    constructor(
        private msgService: MessagesService,
        private readerMetaService: ReaderMetaService,
        private bookService: GetBooksService,
        private userService: UsersService,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit() {
        this.currentUserRole = localStorage.getItem('logedInRole')
        this.currentUserRead = this.currentUserRole === 'ROLE_STUDENT' ? 'student_read' : 'teacher_read'
        this.filter = this.currentUserRead;

        this.getCurrentUserMessages();
    }

    getCurrentUserMessages() {
        this.messages = []

        if(this.currentUserRole === 'ROLE_STUDENT') {
            this.msgService.getStudentsMessages(localStorage.getItem('logedInUsername'))
                .subscribe((res) => {
                    if (res) {
                        this.setupMessages(res);
                    }
                });
        } else if (this.currentUserRole === 'ROLE_TEACHER') {
            this.msgService.getTeachersMessages(localStorage.getItem('logedInUsername'))
                .subscribe((res) => {
                    if (res) {
                        this.setupMessages(res);
                    }
                });
        }
    }

    setupMessages(messages){
        this.allMessages = messages;
        // get only last message of thread and sort by unread
        this.messages = Array.from(new Set(messages.sort((a, b) => b.time_stamp - a.time_stamp).map(a => a.annotation_id)))
            .map(annotation_id => {
                return messages.find(a => a.annotation_id === annotation_id)
            }).sort((a, b) => (a === b ? 0 : a ? -1 : 1));


        // get all information about each message
        this.messages.forEach((message) => {
            this.setUserImage(this.currentUserRole == 'ROLE_STUDENT' ? message.teacher_username : message.student_username );
            this.getBookInfo(message.book_id);
            this.getAnnotations(message.annotation_id);
        })

        // apply search filter
        this.filterMessages()

        // finally group objects
        this.groupedObject = this.groupBy(this.filteredMessages, this.filter);
    }

    ascending(a, b) {
        return (a.teacher_read === b.teacher_read) ? 0 : a.teacher_read ? -1 : 1;
    }

    getResolved() {
        return this.messages.filter((message) => message.resolved == true);
    }

    getUnresolved() {
        return this.messages.filter((message) => message.resolved == false);
    }

    groupBy(objectArray, property) {
        return objectArray.reduce(function (acc, obj) {
            let key = obj[property]
            if (!acc[key]) {
                acc[key] = []
            }
            acc[key].push(obj)
            return acc
        }, {})
    }

    setupCurrentMessage(message: Message) {
        this.currentMessage = message;

        this.getAnnotation(this.currentMessage.annotation_id);
        this.getBook(this.currentMessage.book_id);
    }

    getAnnotation(id: string) {
        this.annotation = this.annotations.get(id);
    }

    private getBook(book_id: number) {
        if(!this.bookInfo.has(book_id.toString())){
            this.getBookInfo(book_id)
        } else
            this.book = this.bookInfo.get(book_id.toString());
    }

    getBookImage() {
        return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(this.book.base64Cover));
    }

    setUserImage(guest_Username: string) {
        if (!this.guestImage.has(guest_Username)) {
            this.guestImage.set(guest_Username, null);
            this.userService.getUser(guest_Username).subscribe((res) => {
                if (res) {
                    this.guestImage.set(guest_Username, res.profileimage);
                }
            })
        }
    }

    getImage(img: any) {
        if (img)
            return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(img));
    }

    setFilter(f) {
        this.filter = f.detail.value;

        this.groupedObject = this.groupBy(this.filteredMessages, this.filter);
    }

    getSearchFilter() {
        this.filterMessages();
        this.groupedObject = this.groupBy(this.filteredMessages, this.filter)
    }

    private getBookInfo(book_id: number) {
        if(!this.bookInfo.has(book_id.toString())) {
            this.bookService.getBook(book_id).subscribe((res) => {
                if (res) {
                    this.bookInfo.set(book_id.toString(), res);
                    this.book = this.bookInfo.get(book_id.toString())
                }
            });
        }
    }

    private getAnnotations(annotation_id: string) {
        if(!this.annotations.has(annotation_id)) {
            this.annotations.set(annotation_id, null);
            this.readerMetaService.getAnnotationById(annotation_id).subscribe((res) => {
                if (res) {
                    this.annotations.set(annotation_id, res);
                }
            });
        }
    }

    /**
     * For filtering messages through search
     * @private
     */
    private filterMessages() {
        switch (this.searchFilter) {
            case ('@username'):
                this.filteredMessages = this.messages.filter(it => {
                    return it.teacher_username.toLocaleLowerCase().includes(this.searchText);
                });
                break;

            default:
                this.filteredMessages = this.messages;
                break;

        }
    }

    updateMessage(message) {
        this.allMessages.forEach((msg) => {
            if (msg.annotation_id == message.annotation_id && message.id != msg.id) {
                if(this.currentUserRead === 'student_read'){
                    msg.student_read = message.student_read;
                } else {
                    msg.teacher_read = message.teacher_read;
                }

                this.msgService.updateMessage(msg).subscribe();
            }
        })

        this.msgService.updateMessage(message).subscribe((res) => {

        });
    }

    markUnread(message: any) {
        let ind = this.messages.findIndex(element => element.id == message.id);
        if(this.currentUserRead === 'student_read'){
            this.messages[ind].student_read = false;
        } else {
            this.messages[ind].teacher_read = false;
        }

        this.updateMessage(message);
    }

    /**
     * Avoids flicker on list update
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): number {
        return item.serialNumber;
    }

    /**
     * Sort groups by student_read or teacher_read
     * @param value
     */
    groupSorted(value) {
        let sortedGroups = value.sort((a, b) => (a.student_read === b.student_read) ? 0 : a.student_read ? 1 : -1)

        if(this.currentUserRead === 'teacher_read'){
            sortedGroups = value.sort((a, b) => (a.teacher_read === b.teacher_read) ? 0 : a.teacher_read ? 1 : -1)
        }

        return sortedGroups
    }
}
