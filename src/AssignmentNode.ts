import { ASTNode } from './ASTNode';
import { ASTNodeCounter } from './ASTNodeCounter';
import { NameNode } from './NameNode';

export class AssignmentNode implements ASTNode {
  id: number;
  constructor(public name: NameNode, public value: ASTNode) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Assignment";
}