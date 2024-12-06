
import { ASTNode } from './ASTNode';
import { ASTNodeCounter } from './ASTNodeCounter';

export class NameNode implements ASTNode {
  id: number;
  constructor(public value: string) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "name";
}
