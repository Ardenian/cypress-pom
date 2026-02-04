import { Base } from "../primitives/base.pom";
import { Button, button } from "../primitives/button.pom";
import { list } from "../traits/list.pom";
import { createPageObjectModelTree } from "../util/cy-page-object-model-tree";

function treeTableExpansionToggleModel<SELECTOR extends string>(
  selector: SELECTOR,
  context?: string,
) {
  return class extends Base {
    constructor() {
      super(selector, context);
    }

    public click() {
      console.log(
        `Clicked on expansion toggle with selector: ${this.selector}`,
      );
    }
  };
}

function treeTableRowModel<SELECTOR extends string>(selector: SELECTOR) {
  return class extends Base {
    public readonly expansionToggle =
      new (class extends treeTableExpansionToggleModel(
        "lib-tree-table-expansion-toggle",
        this.selector,
      ) {})();

    constructor(context?: string, filter?: string) {
      super(selector, context, filter);
    }
  };
}

function treeTableModel<SELECTOR extends string>(selector: SELECTOR) {
  return class extends Base {
    public readonly addButton: Button = button(
      "lib-tree-table-add-button",
      this.selector,
    );

    public readonly rows = list(
      this.selector,
      treeTableRowModel("lib-tree-table-row"),
    );

    constructor(context?: string) {
      super(selector, context);
    }
  };
}

const modelTree = createPageObjectModelTree({
  treeTable: treeTableModel("tree-table-selector"),
});

console.log(modelTree.treeTable.addButton.selector); // Outputs: tree-table-selector lib-tree-table-add-button
modelTree.treeTable.addButton.click(); // Outputs: Clicked on button with selector: tree-table-selector lib-tree-table-add-button
modelTree.treeTable.rows.first().expansionToggle.click(); // Outputs: Clicked on expansion toggle with selector: tree-table-selector lib-tree-table-row:first lib-tree-table-expansion-toggle
console.log(modelTree.treeTable.rows.last().expansionToggle.selector); // Outputs: tree-table-selector lib-tree-table-row:last lib-tree-table-expansion-toggle
