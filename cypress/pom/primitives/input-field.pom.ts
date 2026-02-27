import { ModelConstructor } from "../util/cy-page-object-model-tree";
import { Base } from "./base.pom";

export class InputField extends Base {
  constructor(selector: string, context?: string, filter?: string) {
    super(selector, context, filter);
  }

  public text(text: string) {
    return this.expect.text(text);
  }
}

export function inputField(selector: string): ModelConstructor<InputField> {
  return class extends InputField {
    constructor(context?: string, filter?: string) {
      super(selector, context, filter);
    }
  };
}
