"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
// Função para validar a expressão matemática
function validarExpressao(expressao) {
    // Expressão regular para validar apenas números, operadores matemáticos e parênteses
    const regex = /^[\d+\-*/().\s]+$/;
    return regex.test(expressao);
}
// Função para calcular a expressão matemática
function calcularExpressao(expressao) {
    if (!validarExpressao(expressao)) {
        return 'Expressão inválida! Use apenas números e operadores (+, -, *, /).';
    }
    try {
        // Substitui 'x' por '*' para operadores de multiplicação
        expressao = expressao.replace(/x/g, '*');
        // Avalia a expressão matemática
        const resultado = eval(expressao);
        return resultado;
    }
    catch (error) {
        return 'Erro ao calcular a expressão!';
    }
}
// Função principal para executar a validação e cálculo
function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Digite uma expressão matemática: ', (expressao) => {
        const resultado = calcularExpressao(expressao);
        console.log('Resultado da expressão:', resultado);
        rl.close(); // Fechar a interface após o cálculo
    });
}
// Chamar a função principal
main();
function calculo() {
    // Array com várias expressões de teste
    const expressoesDeTeste = [
        '1+7/5*10', // Teste básico
        '10-2+3*4', // Operadores mistos
        '(2+3)*4', // Parênteses
        '5+5/2', // Divisão
        '3x4/2', // Multiplicação com 'x'
        '7+(8*3)-5/2', // Mais complexa
        '2+2*2', // Ordem das operações
        '10/0', // Divisão por zero (pode causar erro)
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
