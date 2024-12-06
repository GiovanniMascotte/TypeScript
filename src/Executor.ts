import { ASTNode } from './ASTNode';
import { BinaryOpNode } from './BinaryOpNode';
import { NumberNode } from './NumberNode';
import { NameNode } from './NameNode';
import { IfNode } from './IfNode';
import { WhileNode } from './WhileNode';
import { ExecutionContext } from './ExecutionContext';

export function executeAST(node: ASTNode, context: ExecutionContext): number {
  if (node instanceof BinaryOpNode) {
    const left = executeAST(node.left, context);
    const right = executeAST(node.right, context);
    return evaluateBinaryOp(node.operator, left, right);
  } else if (node instanceof NumberNode) {
    return parseFloat(node.value);
  } else if (node instanceof NameNode) {
    return context.getVariable(node.value);
  } else if (node instanceof IfNode) {
    const condition = executeAST(node.condition, context);
    if (condition) {
      return executeAST(node.thenBranch, context);
    } else if (node.elseBranch) {
      return executeAST(node.elseBranch, context);
    }
  } else if (node instanceof WhileNode) {
    let result = 0;
    while (executeAST(node.condition, context)) {
      result = executeAST(node.body, context);
    }
    return result;
  }
  throw new Error(`Unsupported AST node: ${node.type}`);
}

function evaluateBinaryOp(operator: string, left: number, right: number): number {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      if (right === 0) {
        throw new Error("Division by zero.");
      }
      return left / right;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
