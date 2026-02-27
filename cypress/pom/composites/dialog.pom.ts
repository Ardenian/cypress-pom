import { button } from "../primitives/button.pom";
import { container } from "../primitives/container.pom";
import { Schema } from "../util/cy-page-object-model-tree";

export function dialogModel<SCHEMA extends Schema>(
  selector: string,
  content?: SCHEMA,
) {
  return container(
    selector,
    Object.assign(
      {
        confirmButton: button("confirm-button"),
        cancelButton: button("cancel-button"),
        closeButton: button("close-button"),
      },
      content,
    ),
  );
}
