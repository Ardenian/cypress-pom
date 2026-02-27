type FileSchema = string;

interface FolderSchema {
  folders?: { [fileOrFolderName: string]: WorkspaceElementSchema };
  files?: { [fileOrFolderName: string]: WorkspaceElementSchema };
}

type WorkspaceElementSchema = FolderSchema | FileSchema;

interface ProjectSchema {
  elements: { [fileOrFolderName: string]: WorkspaceElementSchema };
}

interface WorkspaceSchema {
  projects: { [projectName: string]: ProjectSchema };
}

interface E2EWorkspaceSchema {
  [name: string]: WorkspaceSchema;
}

// -- Type-level utilities to build a mapped Folder map from the schema --
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type FolderMapFromElements<ELEMENTS> = ELEMENTS extends object
  ? UnionToIntersection<
      {
        [ELEMENT in keyof ELEMENTS]: ELEMENTS[ELEMENT] extends FolderSchema
          ? {
              [KEY in ELEMENT & string]: ELEMENTS[ELEMENT];
            } & FolderMapFromElements<
              // if folders is undefined, pass {} to stop recursion
              ELEMENTS[ELEMENT] extends FolderSchema
                ? ELEMENTS[ELEMENT]["folders"]
                : {}
            >
          : {};
      }[keyof ELEMENTS]
    >
  : {};

type FolderMapFromSchema<E2E> = UnionToIntersection<
  {
    [WORKSPACE in keyof E2E]: E2E[WORKSPACE] extends WorkspaceSchema
      ? {
          [PROJECT in keyof E2E[WORKSPACE]["projects"]]: E2E[WORKSPACE]["projects"][PROJECT] extends ProjectSchema
            ? FolderMapFromElements<
                E2E[WORKSPACE]["projects"][PROJECT]["elements"]
              >
            : {};
        }[keyof E2E[WORKSPACE]["projects"]]
      : {};
  }[keyof E2E]
>;

function createE2EWorkspaces<SCHEMA extends E2EWorkspaceSchema>(
  schema: SCHEMA,
): SCHEMA {
  return schema;
}

const workspaces = createE2EWorkspaces({
  Cypress_Shared: {
    projects: {
      ProjectA: {
        elements: {
          myFolder: {
            folders: {
              nestedFolder: {
                files: { File1: "file1.txt" },
              },
            },
          },
          otherFolder: {
            files: { SomeImage: "image.png" },
          },
        },
      },
    },
  },
  Cypress_Personal: {
    projects: {
      ProjectA: {
        elements: {
          someFolder: {
            files: { File1: "file1.txt" },
          },
        },
      },
    },
  },
});

function collectFoldersFromE2EWorkspaces<SCHEMA extends E2EWorkspaceSchema>(
  schema: SCHEMA,
): FolderMapFromSchema<SCHEMA> {
  const result: { [folderName: string]: FolderSchema } = {};

  for (const workspaceKey in schema) {
    const workspace = schema[workspaceKey];
    if (!workspace || !workspace.projects) continue;

    for (const projectKey in workspace.projects) {
      const project = workspace.projects[projectKey];
      if (!project || !project.elements) continue;

      const processElements = (
        elements:
          | { [fileOrFolderName: string]: WorkspaceElementSchema }
          | undefined,
      ) => {
        if (!elements) return;
        for (const name in elements) {
          const el = elements[name];
          if (typeof el === "string") continue; // file
          // el is a FolderSchema
          result[name] = el;
          if (el.folders) {
            processElements(el.folders);
          }
        }
      };

      processElements(project.elements);
    }
  }

  return result as FolderMapFromSchema<SCHEMA>;
}

const allFolders = collectFoldersFromE2EWorkspaces(workspaces);

console.log("All folders:", allFolders);

const file1 =
  workspaces.Cypress_Shared.projects.ProjectA.elements.myFolder.folders
    .nestedFolder.files.File1;
const otherFile =
  workspaces.Cypress_Personal.projects.ProjectA.elements.someFolder.files.File1;
