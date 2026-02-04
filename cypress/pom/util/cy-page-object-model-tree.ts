import { Base } from "../primitives/base.pom";

export type ModelConstructor<MODEL extends Base = Base> = new (
  context?: string,
  filter?: string,
) => MODEL;

export type ChildSchema<
  MODEL extends Base = Base,
  CHILD_SCHEMA extends Schema = Schema,
> = {
  type: ModelConstructor<MODEL>;
  children: CHILD_SCHEMA;
};

export type Schema = {
  [key: string]: ModelConstructor | ChildSchema;
};

type PageObjectTreeNode<MODEL extends Base = Base> = MODEL;

// Map a Schema type to the resulting tree shape with preserved instance types
type PageObjectTreeFromSchema<SCHEMA extends Schema> = {
  [CHILD in keyof SCHEMA]: SCHEMA[CHILD] extends ModelConstructor<infer MODEL>
    ? PageObjectTreeNode<MODEL>
    : SCHEMA[CHILD] extends ChildSchema<infer MODEL, infer CHILD_SCHEMA>
      ? PageObjectTreeNode<MODEL> &
          PageObjectTreeFromSchema<Extract<CHILD_SCHEMA, Schema>>
      : never;
};

export function createPageObjectModelTree<SCHEMA extends Schema>(
  schema: SCHEMA,
  parentContext?: string,
): PageObjectTreeFromSchema<SCHEMA> {
  const result: any = {};
  for (const key of Object.keys(schema)) {
    const def = schema[key as keyof SCHEMA];
    let ctor: ModelConstructor;
    let children: Schema | undefined;

    if (def && typeof def === "object" && "type" in def) {
      ctor = def.type;
      children = def.children;
    } else {
      ctor = def;
    }

    const instance = new ctor(parentContext);

    if (children) {
      const childNodes = createPageObjectModelTree(children, instance.selector);
      Object.assign(instance, childNodes);
    }

    result[key] = instance;
  }
  return result as PageObjectTreeFromSchema<SCHEMA>;
}
