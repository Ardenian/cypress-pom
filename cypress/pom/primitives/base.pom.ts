import { CyChainable } from "cypress/support/cy-chainable";

export class Base {
  public readonly selector: string;
  constructor(selector: string, context?: string, filter?: string) {
    this.selector = `${context ?? ""} ${selector}${filter ?? ""}`;
  }

  public readonly do = {
    click: () => this.get().click(),
    rightClick: () => this.get().rightclick(),
  };

  public readonly expect = {
    exists: (exists: boolean = true) =>
      this.get().should(exists ? "exist" : "not.exist"),
    visible: (visible: boolean = true) =>
      this.get().should(visible ? "be.visible" : "not.be.visible"),
    present: (present: boolean = true) =>
      this.get().should(present ? "be.visible" : "not.exist"),
    enabled: (enabled: boolean = true) =>
      this.get().should(enabled ? "be.enabled" : "be.disabled"),
    disabled: (disabled: boolean = true) =>
      this.get().should(disabled ? "be.disabled" : "be.enabled"),
  };

  public get(): CyChainable<HTMLElement> {
    return cy.get(this.selector);
  }
}
