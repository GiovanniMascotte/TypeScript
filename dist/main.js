/*
 * <E> ::= <T> { ("+" | "-") <T>}
 * <T> ::= <F> { ("*" | "/") <F>}
 * <F> ::= <N> | <V> | "(" <E> ")"
 * <N> ::= [0-9]
 * <V> ::= [a-zA-Z_][a-zA-Z0-9]*
 */
// definir os tokens que serão utilizados no tokenizador
var TokenType;
(function (TokenType) {
    TokenType["Plus"] = "+";
    TokenType["Minus"] = "-";
    TokenType["Multiply"] = "*";
    TokenType["Divide"] = "/";
    TokenType["LeftParen"] = "(";
    TokenType["RightParen"] = ")";
    TokenType["Number"] = "NUMBER";
    TokenType["Name"] = "NAME";
    TokenType["EOF"] = "EOF";
})(TokenType || (TokenType = {}));
var Token = /** @class */ (function () {
    function Token(type, value) {
        this.type = type;
        this.value = value;
    }
    return Token;
}());
// o lexer é um analizador lexico
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.input = input;
        this.position = 0;
        this.currentChar = null;
        // if(input.length > 0){
        //     this.currentChar = input[0];
        // } else {
        //     this.currentChar = null;
        // }
        this.currentChar = input.length > 0 ? input[0] : null;
    }
    //mover para o proximo caracter
    Lexer.prototype.advance = function () {
        this.position++;
        this.currentChar =
            this.position < this.input.length ? this.input[this.position] : null;
    };
    // ignorar espaço em branco
    Lexer.prototype.skipWhiteSpace = function () {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    };
    //ler um número
    Lexer.prototype.number = function () {
        var result = "";
        while (this.currentChar !== null && /\d/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.Number, result);
    };
    //Ler uma variavel
    Lexer.prototype.name = function () {
        var result = "";
        while (this.currentChar !== null && /[a-zA-Z]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.Name, result);
    };
    //Retorna o prxóximo token
    Lexer.prototype.getNextToken = function () {
        var operatorTokens = {
            "+": TokenType.Plus,
            "-": TokenType.Minus,
            "*": TokenType.Multiply,
            "/": TokenType.Divide,
            "(": TokenType.LeftParen,
            ")": TokenType.RightParen,
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
            if (operatorTokens[this.currentChar]) {
                var token = new Token(operatorTokens[this.currentChar], this.currentChar);
                this.advance();
                return token;
            }
            throw new Error("caracter inv\u00E1lido: ".concat(this.currentChar));
        }
        return new Token(TokenType.EOF, "");
    };
    return Lexer;
}());
var ASTNodeCounter = /** @class */ (function () {
    function ASTNodeCounter() {
    }
    ASTNodeCounter.getNextId = function () {
        return ++this.currentId;
    };
    ASTNodeCounter.currentId = 0;
    return ASTNodeCounter;
}());
// operações binárias
// operação é (2+3)
var BinaryOpNode = /** @class */ (function () {
    function BinaryOpNode(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.type = "BinaryOp";
        this.id = ASTNodeCounter.getNextId();
    }
    return BinaryOpNode;
}());
var NumberNode = /** @class */ (function () {
    function NumberNode(value) {
        this.value = value;
        this.type = "Number";
        this.id = ASTNodeCounter.getNextId();
    }
    return NumberNode;
}());
var NameNode = /** @class */ (function () {
    function NameNode(value) {
        this.value = value;
        this.type = "Name";
        this.id = ASTNodeCounter.getNextId();
    }
    return NameNode;
}());
// parser (Analisador sintático)
var Parser = /** @class */ (function () {
    function Parser(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }
    Parser.prototype.eat = function (tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        }
        else {
            throw new Error("token inesperado: ".concat(this.currentToken.type, ", esperava ").concat(tokenType));
        }
    };
    Parser.prototype.factor = function () {
        var token = this.currentToken;
        if (token.type === TokenType.Number) {
            this.eat(TokenType.Number);
            return new NumberNode(token.value);
        }
        else if (token.type === TokenType.Name) {
            this.eat(TokenType.Name);
            return new NameNode(token.value);
        }
        else if (token.type === TokenType.LeftParen) {
            this.eat(TokenType.LeftParen);
            var node = this.expr();
            this.eat(TokenType.RightParen);
            return node;
        }
        throw new Error("fator invalido: ".concat(token.value));
    };
    Parser.prototype.term = function () {
        var node = this.factor();
        while (this.currentToken.type === TokenType.Multiply ||
            this.currentToken.type === TokenType.Divide) {
            var token = this.currentToken;
            this.eat(token.type);
            node = new BinaryOpNode(node, token.value, this.factor());
        }
        return node;
    };
    Parser.prototype.expr = function () {
        var node = this.term();
        while (this.currentToken.type === TokenType.Plus ||
            this.currentToken.type === TokenType.Minus) {
            var token = this.currentToken;
            this.eat(token.type);
            node = new BinaryOpNode(node, token.value, this.term());
        }
        return node;
    };
    Parser.prototype.parse = function () {
        return this.expr();
    };
    return Parser;
}());
var ExecutionContext = /** @class */ (function () {
    function ExecutionContext() {
        this.variables = {};
    }
    ExecutionContext.prototype.setVariable = function (name, value) {
        this.variables[name] = value;
    };
    ExecutionContext.prototype.getVariable = function (name) {
        if (!(name in this.variables)) {
            throw new Error("Variavel n\u00E3o definida ".concat(name));
        }
        return this.variables[name];
    };
    return ExecutionContext;
}());
function executeAST(node, context) {
    if (node instanceof BinaryOpNode) {
        var left = executeAST(node.left, context);
        var right = executeAST(node.right, context);
        return evaluateBinaryOp(node.operator, left, right);
    }
    else if (node instanceof NumberNode) {
        return parseFloat(node.value);
    }
    else if (node instanceof NameNode) {
        return context.getVariable(node.value);
    }
    throw new Error("N\u00F3 n\u00E3o suportado pela estrutura");
}
function evaluateBinaryOp(operator, left, right) {
    switch (operator) {
        case "+":
            return left + right; // Soma
        case "-":
            return left - right; // Subtração
        case "*":
            return left * right; // Multiplicação
        case "/":
            if (right === 0) {
                throw new Error("Divisão por zero."); // Lança erro se tentar dividir por zero
            }
            return left / right; // Divisão
        default:
            throw new Error("Operador n\u00E3o suportado: ".concat(operator)); // Lança erro se o operador não for suportado
    }
}
try {
    var input = " a + b * (c-3) /2";
    var lexer = new Lexer(input);
    var parser = new Parser(lexer);
    var ast = parser.parse();
    var context = new ExecutionContext();
    context.setVariable("a", 5);
    context.setVariable("b", 10);
    context.setVariable("c", 8);
    var result = executeAST(ast, context);
    console.log("O resultado da expressa ".concat(input, " \u00E9 ").concat(result));
}
catch (error) {
    console.error("Erro durante a execução");
    console.error(error.message);
}
