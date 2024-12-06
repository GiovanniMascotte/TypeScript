
export class ASTNodeCounter {
  private static currentId: number = 0;
  public static getNextId(): number {
    return ++this.currentId;
  }
}
