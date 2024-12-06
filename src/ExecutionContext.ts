
export class ExecutionContext {
  private variables: { [key: string]: number } = {};

  public setVariable(name: string, value: number) {
    this.variables[name] = value;
  }

  public getVariable(name: string): number {
    if (!(name in this.variables)) {
      throw new Error(`Undefined variable: ${name}`);
    }
    return this.variables[name];
  }
}
