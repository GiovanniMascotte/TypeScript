
import { ASTNode } from './ASTNode';
import { ASTNodeCounter } from './ASTNodeCounter';

export class NumberNode implements ASTNode {
  id: number;
  constructor(public value: string) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "number";
}
