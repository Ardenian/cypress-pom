import { ModelConstructor, Schema } from "../util/cy-page-object-model-tree";
import { Base } from "./base.pom";

export class Container extends Base {
  constructor(selector: string, context?: string, filter?: string) {
    super(selector, context, filter);
  }
}

export function containerModel<SCHEMA extends Schema>(
  selector: string,
  schema: SCHEMA,
): { type: ModelConstructor; children: SCHEMA } {
  return {
    type: class extends Container {
      constructor(_context?: string, _filter?: string) {
        super(selector);
      }
    },
    children: schema,
  };
}

export function container<SCHEMA extends Schema>(
  selector: string,
  schema: SCHEMA,
): Container {
  return new (class extends containerModel<SCHEMA>(selector, schema).type {})();
}
