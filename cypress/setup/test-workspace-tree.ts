type FileSchema = string;

interface FolderSchema<
  CONTENT_SCHEMA extends WorkspaceElementSchema = WorkspaceElementSchema,
> {
  folders?: { [fileOrFolderName: string]: CONTENT_SCHEMA };
  files?: { [fileOrFolderName: string]: CONTENT_SCHEMA };
}

type WorkspaceElementSchema = FolderSchema | FileSchema;

interface ProjectSchema<
  CONTENT_SCHEMA extends WorkspaceElementSchema = WorkspaceElementSchema,
> {
  elements: { [fileOrFolderName: string]: CONTENT_SCHEMA };
}

interface WorkspaceSchema<
  CONTENT_SCHEMA extends ProjectSchema = ProjectSchema,
> {
  projects: { [projectName: string]: CONTENT_SCHEMA };
}

interface E2EWorkspaceSchema {
  [name: string]: WorkspaceSchema;
}

const workspaces: E2EWorkspaceSchema = {
  Cypress_Shared: {
    projects: {
      ProjectA: {
        elements: {
          folder: {
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
          folder: {
            files: { File1: "file1.txt" },
          },
        },
      },
    },
  },
};
