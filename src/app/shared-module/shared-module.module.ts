import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionaryComponent } from "../Components/popover/word-options/dictionary/dictionary.component";
import { IonicModule } from '@ionic/angular';
import { RatingComponent } from "../Components/rating/rating.component";
import { AwardComponent } from "../teacher/lessons/create-lesson/award/award.component";
import { AwardCardComponent } from "../teacher/award/award-card/award-card.component";
import { BadgeRowComponent } from "../Components/badge-row/badge-row.component";
import { BookSearchPipeComponent } from "../Pipes/book-search-pipe/book-search-pipe.component";
import { LessonPipe } from "../Pipes/lesson-pipe/lesson.pipe";
import { StudentAvatarsComponent } from '../Components/student-avatars/student-avatars.component';
import { AwardReceivedComponent } from '../Components/award-received/award-received.component';
import { ExperienceBarComponent } from '../Components/experience-bar/experience-bar.component';
import { HeaderComponent } from "../Components/header/header.component";
import { BadgeRowStudentComponent } from '../Components/badge-row-student/badge-row-student.component';
import { AssignClassCardComponent } from "../teacher/lessons/create-lesson/basic-info/assign-class-card/assign-class-card.component";
import { AssignGroupCardComponent } from "../teacher/lessons/create-lesson/basic-info/assign-group-card/assign-group-card.component";
import { AddReadingBookSelectPopoverComponent } from "../teacher/lessons/create-lesson/add-reading/add-reading-book-select-popover/add-reading-book-select-popover.component";
import { FormsModule } from "@angular/forms";
import { AddGroupModalComponent } from "../modals/groups/add-group-modal/add-group-modal.component";
import { GroupOptionsPopoverComponent } from "../teacher/classes/group-options-popover/group-options-popover.component";
import { UserCardComponent } from "../Components/user-card/user-card.component";
import { TopBadgesComponent } from "../Components/top-badges/top-badges.component";
import { SideMenuComponent } from '../Components/side-menu/side-menu.component';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        DictionaryComponent,
        RatingComponent,
        AwardComponent,
        AwardCardComponent,
        BadgeRowComponent,
        BadgeRowStudentComponent,
        BookSearchPipeComponent,
        LessonPipe,
        StudentAvatarsComponent,
        AwardReceivedComponent,
        StudentAvatarsComponent,
        ExperienceBarComponent,
        HeaderComponent,
        AssignClassCardComponent,
        AssignGroupCardComponent,
        AddReadingBookSelectPopoverComponent,
        AddGroupModalComponent,
        GroupOptionsPopoverComponent,
        UserCardComponent,
        TopBadgesComponent, 
        SideMenuComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        FormsModule, 
        RouterModule
    ],
    exports: [
        DictionaryComponent,
        RatingComponent,
        AwardComponent,
        AwardCardComponent,
        BadgeRowComponent,
        BadgeRowStudentComponent,
        BookSearchPipeComponent,
        LessonPipe,
        StudentAvatarsComponent,
        AwardReceivedComponent,
        StudentAvatarsComponent,
        ExperienceBarComponent,
        HeaderComponent,
        AssignClassCardComponent,
        AssignGroupCardComponent,
        AddReadingBookSelectPopoverComponent,
        AddGroupModalComponent,
        GroupOptionsPopoverComponent,
        UserCardComponent,
        TopBadgesComponent,
        SideMenuComponent
    ]
})
export class SharedModuleModule { }
