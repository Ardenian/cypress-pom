export class Base {
  public readonly selector: string;
  constructor(selector: string, context?: string, filter?: string) {
    this.selector = `${context ?? ""} ${selector}${filter ?? ""}`;
  }
}
