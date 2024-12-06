
import { ASTNode } from './ASTNode';
import { ASTNodeCounter } from './ASTNodeCounter';

export class BinaryOpNode implements ASTNode {
  id: number;
  constructor(
    public left: ASTNode,
    public operator: string,
    public right: ASTNode
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "BinaryOp";
}
