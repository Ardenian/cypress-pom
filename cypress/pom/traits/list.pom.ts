import { Base } from "../primitives/base.pom";
import { ModelConstructor } from "../util/cy-page-object-model-tree";

export function listModel<CHILD_MODEL extends Base>(
  selector: string,
  ctor: ModelConstructor<CHILD_MODEL>,
) {
  return class extends Base {
    constructor(context?: string) {
      super(selector, context);
    }

    public first(): CHILD_MODEL {
      return new ctor(this.selector, ":first");
    }

    public at(index: number): CHILD_MODEL {
      return new ctor(this.selector, `:eq${index}`);
    }

    public last(): CHILD_MODEL {
      return new ctor(this.selector, ":last");
    }
  };
}

export function list<CHILD_MODEL extends Base>(
  selector: string,
  ctor: ModelConstructor<CHILD_MODEL>,
) {
  return new (class extends listModel(selector, ctor) {})();
}
