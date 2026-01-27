class Base<SELECTOR extends string = string> {
  public readonly selector: string;
  constructor(selector: SELECTOR, context?: string, filter?: string) {
    this.selector = `${context ?? ""} ${selector}${filter ?? ""}`;
  }
}

class Name extends Base {
  constructor(context?: string) {
    super("Name", context);
  }

  public hello() {
    console.log("Hello");
  }
}

class Interval extends Base {
  constructor(context?: string) {
    super("Interval", context);
  }
}

class Type extends Base {
  constructor(context?: string) {
    super("Type", context);
  }
}

class Button<S extends string> extends Base {
  constructor(selector: S, context?: string, filter?: string) {
    super(selector, context, filter);
  }

  public click() {
    console.log(`Clicked on button with selector: ${this.selector}`);
  }
}

function button<SELECTOR extends string>(
  selector: SELECTOR,
): Constructor<Button<SELECTOR>> {
  return class extends Button<SELECTOR> {
    // preserve the generic in the returned class type
    constructor(context?: string, filter?: string) {
      super(selector, context, filter);
    }
  };
}

function list<SELECTOR extends string, M extends Base<SELECTOR>>(
  selector: string,
  ctor: Constructor<M>,
) {
  return class extends Base {
    constructor(context?: string) {
      super(selector, context);
    }

    public first(): M {
      return new ctor(this.selector, ":first");
    }
  };
}

// Factory types
type Constructor<MODEL extends Base = Base> = new (
  context?: string,
  filter?: string,
) => MODEL;
// keep a loose Schema shape for runtime, concrete typing comes from S in generics
type Schema = {
  [key: string]: Constructor | { type: Constructor; children: Schema };
};

// Node produced by the factory (generic instance type)
type PageObjectTreeNode<MODEL extends Base = Base> = MODEL & {
  [child: string]: any;
};

// Map a Schema type to the resulting tree shape with preserved instance types
type PageObjectTreeFromSchema<SCHEMA extends Schema> = {
  [CHILD in keyof SCHEMA]: SCHEMA[CHILD] extends Constructor<infer MODEL>
    ? PageObjectTreeNode<MODEL>
    : SCHEMA[CHILD] extends {
          type: Constructor<infer MODEL>;
          children: infer CHILD_SCHEMA;
        }
      ? PageObjectTreeNode<MODEL> &
          PageObjectTreeFromSchema<Extract<CHILD_SCHEMA, Schema>>
      : never;
};

// make the factory generic so the return type is inferred from the schema passed in
function createPageObjectModelTree<SCHEMA extends Schema>(
  schema: SCHEMA,
  parentContext?: string,
): PageObjectTreeFromSchema<SCHEMA> {
  const result: any = {};
  for (const key of Object.keys(schema)) {
    const def = schema[key as keyof SCHEMA] as any;
    let ctor: Constructor;
    let children: Schema | undefined;

    if (def && typeof def === "object" && "type" in def) {
      ctor = def.type;
      children = def.children;
    } else {
      ctor = def as Constructor;
    }

    const instance = new ctor(parentContext);
    const node: any = instance;

    if (children) {
      const childNodes = createPageObjectModelTree(children, instance.selector);
      Object.assign(node, childNodes);
    }

    result[key] = node;
  }
  return result as PageObjectTreeFromSchema<SCHEMA>;
}

// Example schema and created tree
const modelTree = createPageObjectModelTree({
  name: Name,
  interval: {
    type: Interval,
    children: {
      nestedType: Type,
      nestedName: Name,
      nestedInterval: { type: Interval, children: { deeplyNestedType: Type } },
    },
  },
  list: list("button-list", button("button-of-list")),
  type: Type,
  testButton: button("button-selector"),
  otherButton: {
    type: button("other-button-selector"),
    children: { name: Name },
  },
});

{
  const { name, interval, type, testButton, otherButton } = modelTree;
  name.hello(); // Logs "Hello"
  interval.nestedName.hello(); // Logs "Hello"
  console.log(interval.nestedInterval.deeplyNestedType.selector);
  console.log(testButton.selector);
  testButton.click(); // Logs "Clicked on button with selector: button-selector"
  otherButton.name.hello();

  modelTree.list.first().click(); // Logs "Clicked on button with selector: button-of-list:first"
  console.log(modelTree.list.first().selector);
}
