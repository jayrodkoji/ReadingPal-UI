import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

declare var ePub: any;

@Component({
  selector: 'app-chapter-select-popover',
  templateUrl: './chapter-select-popover.page.html',
  styleUrls: ['./chapter-select-popover.page.scss'],
})
export class ChapterSelectPopoverPage implements OnInit {
  @Input() bookId;
  toc: any;
  loadingToc: boolean;
  book: any;
  private rendition: any;

  constructor(private http: HttpClient, private popoverCtrl: PopoverController) { }
    
  ngOnInit() {
    this.getBookToc()
  }

  getBookToc() {
    if(this.bookId){
      this.loadingToc = true;
      this.toc = []

      this.book = ePub();

      this.http.get(environment.gatewayBaseUrl + '/books/getBookWithEBook?id=' + this.bookId).subscribe((data: any) => {
        this.book.open(data.base64eBook, 'base64').then(() => {

          // get all sections of the book
          this.book.loaded.navigation.then((toc) => {
            this.toc = this.getToc(toc);
            this.loadingToc = false;

            console.log(this.toc)
          });
        });
      }); 
    }
  }

  getToc(toc) {
    var sections = [];
      if(toc.length){
        toc.forEach((section) => {
          sections.push(section);
          
          // uses recusion for oddly nested epubs
          sections = sections.concat(this.getToc(section.subitems))
        });
      }
    
    return sections;
  }

  submitChapter(chapter, ind) {
    let endLoc = this.toc[ind + 1]
    this.popoverCtrl.dismiss({
      'startLoc': chapter,
      'endLoc': endLoc
    })
  }
}
