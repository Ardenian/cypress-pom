import { buttonModel } from "../primitives/button.pom";
import { containerModel } from "../primitives/container.pom";
import { Schema } from "../util/cy-page-object-model-tree";

export function dialogModel<SCHEMA extends Schema>(
  selector: string,
  content?: SCHEMA,
) {
  return containerModel(
    selector,
    Object.assign(
      {
        confirmButton: buttonModel("confirm-button"),
        cancelButton: buttonModel("cancel-button"),
        closeButton: buttonModel("close-button"),
      },
      content,
    ),
  );
}
