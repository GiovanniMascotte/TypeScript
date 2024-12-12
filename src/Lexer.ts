import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Lexer {
  private position: number = 0;
  private currentChar: string | null = null;

  private readonly keywords: { [key: string]: TokenType } = {
    if: TokenType.If,
    else: TokenType.Else,
    while: TokenType.While,
    then: TokenType.Then,
    do: TokenType.Do,
  };

  constructor(private readonly input: string) {
    this.currentChar = input.length > 0 ? input[0] : null;
  }

  private advance(): void {
    this.position++;
    this.currentChar =
      this.position < this.input.length ? this.input[this.position] : null;
  }

  private skipWhiteSpace(): void {
    while (this.currentChar !== null && /\\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  private number(): Token {
    let result = "";
    while (this.currentChar !== null && /\\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return new Token(TokenType.Number, result);
  }

  private name(): Token {
    let result = "";
    while (this.currentChar !== null && /[a-zA-Z]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    const type = this.keywords[result] || TokenType.Name;
    return new Token(type, result);
  }
  private comparisonOperator(): Token {
    const operators = ["<", ">", "<=", ">=", "=="];
    let result = "";
    while (this.currentChar !== null && /[<>=]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (operators.includes(result)) {
      return new Token(TokenType.ComparisonOperator, result);
    }
    throw new Error(`Invalid operator: ${result}`);
  }
  public getNextToken(): Token {
    const operatorTokens: { [key: string]: TokenType } = {
      "+": TokenType.Plus,
      "-": TokenType.Minus,
      "*": TokenType.Multiply,
      "/": TokenType.Divide,
      "(": TokenType.LeftParen,
      ")": TokenType.RightParen,
      "{": TokenType.LeftBrace,
      "}": TokenType.RightBrace,
    };
    
    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhiteSpace();
        continue;
      }
      if (/\d/.test(this.currentChar)) {
        return this.number();
      }
      if (/[a-zA-Z]/.test(this.currentChar)) {
        return this.name();
      }
      if (/[<>=]/.test(this.currentChar)) {
        return this.comparisonOperator(); // Chama o método para operadores de comparação
      }
      if (operatorTokens[this.currentChar]) {
        const token = new Token(
          operatorTokens[this.currentChar],
          this.currentChar
        );
        this.advance();
        return token;
      }
      throw new Error(`Invalid character: ${this.currentChar}`);
    }
    
    return new Token(TokenType.EOF, "");
  }
}