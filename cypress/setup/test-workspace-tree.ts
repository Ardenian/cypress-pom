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

const file1 =
  workspaces.Cypress_Shared.projects.ProjectA.elements.myFolder.folders
    .nestedFolder.files.File1;
const otherFile =
  workspaces.Cypress_Personal.projects.ProjectA.elements.someFolder.files.File1;
