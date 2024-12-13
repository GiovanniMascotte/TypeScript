export class ExecutionContext {
  private variables: Map<string, number>;

  constructor() {
    this.variables = new Map();
  }

  // definir variavel
  setVariable(name: string, value: number) {
    console.log(`Definindo variável: ${name} = ${value}`);
    this.variables.set(name, value);
  }

  getVariable(name: string): number {
    return this.variables.get(name) || 0; // retorna 0 se nao achar a variavel
  }
}
