class Base {
  public readonly selector: string;
  constructor(selector: string, context?: string, filter?: string) {
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

class Container<S extends string> extends Base {
  constructor(selector: S, context?: string, filter?: string) {
    super(selector, context, filter);
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

function list<M extends Base>(selector: string, ctor: Constructor<M>) {
  return class extends Base {
    constructor(context?: string) {
      super(selector, context);
    }

    public first(): M {
      return new ctor(this.selector, ":first");
    }
  };
}

function container<S extends string, SCHEMA extends Schema>(
  selector: S,
  schema: SCHEMA,
): { type: Constructor; children: SCHEMA } {
  return {
    type: class extends Container<S> {
      constructor(_context?: string, _filter?: string) {
        super(selector);
      }
    },
    children: schema,
  };
}

function dialog<S extends string, SCHEMA extends Schema>(
  selector: S,
  content?: SCHEMA,
) {
  const sharedDialogContent = {
    confirmButton: button("confirm-button"),
    cancelButton: button("cancel-button"),
    closeButton: button("close-button"),
  };
  return container(selector, Object.assign(sharedDialogContent, content));
}

// Factory types
type Constructor<MODEL extends Base = Base> = new (
  context?: string,
  filter?: string,
) => MODEL;

// child schema shape for nested nodes (reusable)
type ChildSchema<
  MODEL extends Base = Base,
  CHILD_SCHEMA extends Schema = Schema,
> = {
  type: Constructor<MODEL>;
  children: CHILD_SCHEMA;
};

// keep a loose Schema shape for runtime, concrete typing comes from S in generics
type Schema = {
  [key: string]: Constructor | ChildSchema;
};

// Node produced by the factory (generic instance type)
type PageObjectTreeNode<MODEL extends Base = Base> = MODEL & {
  [child: string]: any;
};

// Map a Schema type to the resulting tree shape with preserved instance types
type PageObjectTreeFromSchema<SCHEMA extends Schema> = {
  [CHILD in keyof SCHEMA]: SCHEMA[CHILD] extends Constructor<infer MODEL>
    ? PageObjectTreeNode<MODEL>
    : SCHEMA[CHILD] extends ChildSchema<infer MODEL, infer CHILD_SCHEMA>
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
    const def = schema[key as keyof SCHEMA];
    let ctor: Constructor;
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
  container: container("container-selector", {
    innerButton: button("inner-button-selector"),
    innerType: Type,
  }),
  dialogBox: dialog("dialog-selector", {
    extraButton: button("extra-button-selector"),
    list: list("dialog-button-list", button("dialog-button-of-list")),
  }),
});

{
  const { name, interval, type, testButton, otherButton } = modelTree;
  name.hello(); // Logs "Hello"
  interval.nestedName.hello(); // Logs "Hello"
  console.log(interval.nestedInterval.deeplyNestedType.selector);
  console.log(testButton.selector);
  testButton.click(); // Logs "Clicked on button with selector: button-selector"
  otherButton.name.hello();
  console.log(type.selector);

  modelTree.list.first().click(); // Logs "Clicked on button with selector: button-of-list:first"
  console.log(modelTree.list.first().selector);
  modelTree.container.innerButton.click();
  console.log(modelTree.container.innerButton.selector);

  modelTree.dialogBox.confirmButton.click();
  modelTree.dialogBox.extraButton.click();
  modelTree.dialogBox.list.first().click();
}
