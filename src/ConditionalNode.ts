import { ASTNode } from './ASTNode';
import { ASTNodeCounter } from './ASTNodeCounter';
// Representa uma expressão condicional (ex.: x < 10)
export class ConditionalNode implements ASTNode {
    id: number;
    constructor(
      public left: ASTNode,
      public operator: string,
      public right: ASTNode
    ) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "conditional";
  }