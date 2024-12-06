import { ASTNode } from './ASTNode';
import { ASTNodeCounter } from './ASTNodeCounter';

export class WhileNode implements ASTNode {
  id: number;
  constructor(public condition: ASTNode, public body: ASTNode) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "While";
}
