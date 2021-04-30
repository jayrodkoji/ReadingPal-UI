import { LessonPipe } from './lesson.pipe';

describe('LessonPipe', () => {
  it('create an instance', () => {
    const pipe = new LessonPipe();
    expect(pipe).toBeTruthy();
  });
});
