import * as readline from 'readline';

// Função para validar a expressão matemática
function validarExpressao(expressao: string): boolean {
    // Expressão regular para validar apenas números, operadores matemáticos e parênteses
    const regex = /^[\d+\-*/().\s]+$/;
    return regex.test(expressao);
}

// Função para calcular a expressão matemática
function calcularExpressao(expressao: string): number | string {
    if (!validarExpressao(expressao)) {
        return 'Expressão inválida! Use apenas números e operadores (+, -, *, /).';
    }

    try {
        // Substitui 'x' por '*' para operadores de multiplicação
        expressao = expressao.replace(/x/g, '*');

        // Avalia a expressão matemática
        const resultado = eval(expressao);
        return resultado;
    } catch (error) {
        return 'Erro ao calcular a expressão!';
    }
}

// Função principal para executar a validação e cálculo
function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Digite uma expressão matemática: ', (expressao: string) => {
        const resultado = calcularExpressao(expressao);
        console.log('Resultado da expressão:', resultado);
        rl.close();  // Fechar a interface após o cálculo
    });
}

// Chamar a função principal
main();




function calculo() {
    // Array com várias expressões de teste
    const expressoesDeTeste = [
        '1+7/5*10',  // Teste básico
        '10-2+3*4',  // Operadores mistos
        '(2+3)*4',   // Parênteses
        '5+5/2',     // Divisão
        '3x4/2',     // Multiplicação com 'x'
        '7+(8*3)-5/2', // Mais complexa
        '2+2*2',     // Ordem das operações
        '10/0',      // Divisão por zero (pode causar erro)
        '10 + invalid', // Expressão inválida
    ];

    // Iterar sobre as expressões e calcular cada uma
    expressoesDeTeste.forEach(expressao => {
        const resultado = calcularExpressao(expressao);
        console.log(`Expressão: ${expressao} | Resultado: ${resultado}`);
    });
}

// Chamar a função principal
calculo();
