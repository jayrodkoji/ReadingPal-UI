import { Awards } from './Awards';
import { Quiz } from './Quiz';
import { Reading } from './Reading';
import { Vocabulary } from './Vocabulary';

export interface ConceptBlock {
    id: number;
    reading: Reading;
    quiz: Quiz;
    vocab: Vocabulary;
    Awards: Awards;
}
