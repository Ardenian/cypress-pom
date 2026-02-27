import { button } from "../primitives/button.pom";
import { container } from "../primitives/container.pom";
import { inputField } from "../primitives/input-field.pom";
import { label } from "../primitives/label.pom";
import { createPageObjectModelTree } from "../util/cy-page-object-model-tree";
import { treeTable } from "./tree-table.pom";

const workbench = createPageObjectModelTree({
  header: container("workbench-header", {
    workspaceName: label("workspace-name"),
  }),
  leftSidebar: container("left-sidebar", {
    navigator: container("navigator", {
      searchField: inputField("search-field"),
      filterButton: button("filter-button"),
      files: treeTable("files-table"),
    }),
  }),
  rightSidebar: container("left-sidebar", {
    featureStructure: container("feature-structure-view", {
      searchField: inputField("search-field"),
      files: treeTable("feature-structure-elements-table"),
    }),
  }),
});

console.log(workbench.header.workspaceName);
console.log(workbench.leftSidebar.navigator.files.rows.first().selector);
