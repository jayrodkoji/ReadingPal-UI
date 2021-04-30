// Currently unused. We need to design the lesson plan concept.

import {LessonData} from './lesson-data';

export class LessonPlanData
{
    constructor(
        public name: string,
        public icon: string,
        public creatorId: number,
        public lessons: Array<LessonData>
    ) {}
}
