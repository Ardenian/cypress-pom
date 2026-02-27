type FileSchema = string;

interface FolderSchema<
  CONTENT_SCHEMA extends WorkspaceElementSchema = WorkspaceElementSchema,
> {
  folders?: { [fileOrFolderName: string]: CONTENT_SCHEMA };
  files?: { [fileOrFolderName: string]: CONTENT_SCHEMA };
}

type WorkspaceElementSchema = FolderSchema | FileSchema;

interface ProjectSchema<
  CONTENT_SCHEMA extends FolderSchema | FileSchema = FolderSchema | FileSchema,
> {
  elements: { [fileOrFolderName: string]: CONTENT_SCHEMA };
}

interface WorkspaceSchema<
  CONTENT_SCHEMA extends ProjectSchema = ProjectSchema,
> {
  projects: { [projectName: string]: CONTENT_SCHEMA };
}

interface E2EWorkspaceSchema<
  CONTENT_SCHEMA extends WorkspaceSchema = WorkspaceSchema,
> {
  [name: string]: CONTENT_SCHEMA;
}

function createE2EWorkspaces<
  SCHEMA extends E2EWorkspaceSchema = E2EWorkspaceSchema,
>(schema: SCHEMA) {
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

console.log(
  workspaces.Cypress_Shared.projects.ProjectA.elements.myFolder.folders
    .nestedFolder.files.File1,
);
