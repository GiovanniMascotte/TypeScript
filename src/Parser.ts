import { TokenType } from './TokenType';
import { Token } from './Token';
import { Lexer } from './Lexer';
import { ASTNode } from './ASTNode';
import { BinaryOpNode } from './BinaryOpNode';
import { NumberNode } from './NumberNode';
import { NameNode } from './NameNode';
import { IfNode } from './IfNode';
import { WhileNode } from './WhileNode';

export class Parser {
  private currentToken!: Token;

  constructor(private lexer: Lexer) {
    this.currentToken = this.lexer.getNextToken();
  }

  private eat(tokenType: TokenType): void {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(
        `Unexpected token: ${this.currentToken.type}, expected: ${tokenType}`
      );
    }
  }

  private factor(): ASTNode {
    const token = this.currentToken;
    if (token.type === TokenType.Number) {
      this.eat(TokenType.Number);
      return new NumberNode(token.value);
    } else if (token.type === TokenType.Name) {
      this.eat(TokenType.Name);
      return new NameNode(token.value);
    } else if (token.type === TokenType.LeftParen) {
      this.eat(TokenType.LeftParen);
      const node = this.expr();
      this.eat(TokenType.RightParen);
      return node;
    }
    throw new Error(`Invalid factor: ${token.value}`);
  }

  private term(): ASTNode {
    let node = this.factor();
    while (
      this.currentToken.type === TokenType.Multiply ||
      this.currentToken.type === TokenType.Divide
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new BinaryOpNode(node, token.value, this.factor());
    }
    return node;
  }

  private expr(): ASTNode {
    let node = this.term();
    while (
      this.currentToken.type === TokenType.Plus ||
      this.currentToken.type === TokenType.Minus
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new BinaryOpNode(node, token.value, this.term());
    }
    return node;
  }

  private parseIf(): ASTNode {
    this.eat(TokenType.If); // Consome 'if'
    const condition = this.expr(); // Condição
    this.eat(TokenType.Then); // Consome 'then'
    const thenBranch = this.expr(); // Corpo do 'if'
    let elseBranch: ASTNode | null = null;
    if (this.currentToken.type === TokenType.Else) {
      this.eat(TokenType.Else); // Consome 'else'
      elseBranch = this.expr(); // Corpo do 'else'
    }
    return new IfNode(condition, thenBranch, elseBranch);
  }
  
  private parseWhile(): ASTNode {
    this.eat(TokenType.While); // Consome 'while'
    const condition = this.expr(); // Condição
    this.eat(TokenType.Do); // Consome 'do'
    const body = this.expr(); // Corpo do loop
    return new WhileNode(condition, body);
  }

  public parse(): ASTNode {
    if (this.currentToken.type === TokenType.If) {
      return this.parseIf();
    } else if (this.currentToken.type === TokenType.While) {
      return this.parseWhile();
    }
    return this.expr();
  }
}
