import { ASTNode } from './ASTNode';
import { ASTNodeCounter } from './ASTNodeCounter';

export class IfNode implements ASTNode {
  id: number;
  constructor(
    public condition: ASTNode,
    public thenBranch: ASTNode,
    public elseBranch: ASTNode | null = null
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "If";
}
