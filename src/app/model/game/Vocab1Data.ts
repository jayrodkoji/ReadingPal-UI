export class Vocab1Word
{
  public constructor(
    public word: string,
    public definition: string) {}
}

export class Vocab1Data
{
  public words: Vocab1Word[];
}
