import { ModelConstructor } from "../util/cy-page-object-model-tree";
import { Base } from "./base.pom";

export class Label extends Base {
  constructor(selector: string, context?: string, filter?: string) {
    super(selector, context, filter);
  }

  public text(text: string) {
    return this.expect.text(text);
  }
}

export function label(selector: string): ModelConstructor<Label> {
  return class extends Label {
    constructor(context?: string, filter?: string) {
      super(selector, context, filter);
    }
  };
}
