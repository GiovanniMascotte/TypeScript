import * as fs from 'fs';
import { Lexer } from './Lexer';
import { Parser } from './Parser';
import { ExecutionContext } from './ExecutionContext';
import { executeAST } from './Executor';

try {
    // Obtém o nome do arquivo a partir dos argumentos da linha de comando
    const args = process.argv.slice(2);
    if (args.length === 0) {
        throw new Error("Por favor, forneça o nome de um arquivo .prg para executar.");
    }

    const inputFile = args[0];

    // Verifica se o arquivo existe
    if (!fs.existsSync(inputFile)) {
        throw new Error(`Arquivo não encontrado: ${inputFile}`);
    }

    // Lê o arquivo externo que contém as instruções
    const input = fs.readFileSync(inputFile, 'utf-8');

    console.log(`Executando o arquivo: ${inputFile}`);
    console.log(`Conteúdo do arquivo:\n${input}`);

    // Divide as linhas do arquivo para processar separadamente
    const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Contexto de execução com variáveis iniciais
    const context = new ExecutionContext();

    // Processa cada linha com tratamento detalhado de erros
    lines.forEach((line, index) => {
        try {
            if (line.includes('=')) {
                // Processa atribuições no formato `variavel = valor`
                const [name, value] = line.split('=').map(part => part.trim());
                context.setVariable(name, parseFloat(value));
            } else {
                // Processa expressões (usando Lexer e Parser)
                const lexer = new Lexer(line);
                const parser = new Parser(lexer);
                const ast = parser.parse();

                // Executa a AST
                executeAST(ast, context);
            }
        } catch (error) {
            console.error(`Erro na linha ${index + 1}: ${line}`);
            if (error instanceof Error) {
                console.error(`Detalhes do erro: ${error.message}`);
            }
            throw error; // Re-lança o erro após logar para interromper a execução
        }
    });

    // Exibe o valor final de todas as variáveis
    console.log('\nValores finais das variáveis:');
    for (const variable in context) {
        console.log(`${variable} = ${context.getVariable(variable)}`);
    }
} catch (error) {
    console.error("Erro durante a execução do programa:");
    if (error instanceof Error) {
        console.error(error.message);
    }
}
