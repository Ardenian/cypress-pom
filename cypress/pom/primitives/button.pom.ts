import { ModelConstructor } from "../util/cy-page-object-model-tree";
import { Base } from "./base.pom";

export class Button extends Base {
  constructor(selector: string, context?: string, filter?: string) {
    super(selector, context, filter);
  }

  public click() {
    console.log(`Clicked on button with selector: ${this.selector}`);
  }
}

export function buttonModel(selector: string): ModelConstructor<Button> {
  return class extends Button {
    constructor(context?: string, filter?: string) {
      super(selector, context, filter);
    }
  };
}

export function button(
  selector: string,
  context?: string,
  filter?: string,
): Button {
  return new (class extends buttonModel(selector) {
    constructor() {
      super(context, filter);
    }
  })();
}
