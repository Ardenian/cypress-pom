type FileSchema = string;

interface FolderSchema<
  CONTENT_SCHEMA extends WorkspaceElementSchema = WorkspaceElementSchema,
> {
  [fileOrFolderName: string]: CONTENT_SCHEMA;
}

type WorkspaceElementSchema = FolderSchema | FileSchema;

interface ProjectSchema<
  CONTENT_SCHEMA extends WorkspaceElementSchema = WorkspaceElementSchema,
> {
  [fileOrFolderName: string]: CONTENT_SCHEMA;
}

interface WorkspaceSchema<
  CONTENT_SCHEMA extends ProjectSchema = ProjectSchema,
> {
  [projectName: string]: CONTENT_SCHEMA;
}

interface E2EWorkspaceSchema {
  [name: string]: WorkspaceSchema;
}

const workspaces: E2EWorkspaceSchema = {
  Cypress_Shared: {
    ProjectA: {
      folder: {
        nestedFolder: {
          File1: "file1.txt",
        },
      },
      otherFolder: {
        SomeImage: "image.png",
      },
    },
  },
  Cypress_Personal: {
    ProjectA: {
      folder: {
        nestedFolder: {
          File1: "file1.txt",
        },
      },
    },
  },
};
