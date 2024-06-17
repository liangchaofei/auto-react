import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.createReactComponent",
    async () => {
      const folderName = await vscode.window.showInputBox({
        placeHolder: "Enter the folder name for your new React component",
      });

      if (!folderName) {
        vscode.window.showErrorMessage("Folder name cannot be empty");
        return;
      }

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("Please open a workspace folder first");
        return;
      }

      const workspacePath = workspaceFolders[0].uri.fsPath;
      const componentFolderPath = path.join(workspacePath, folderName);

      try {
        fs.mkdirSync(componentFolderPath);
        const componentCode = `
import React from 'react';
import './${folderName}.css';

const ${folderName} = () => {
    return (
        <div className="${folderName}">
            <h1>${folderName} Component</h1>
        </div>
    );
};

export default ${folderName};
            `;

        const cssCode = `
.${folderName} {
    /* Add your styles here */
}
            `;

        fs.writeFileSync(
          path.join(componentFolderPath, `${folderName}.tsx`),
          componentCode
        );
        fs.writeFileSync(
          path.join(componentFolderPath, `${folderName}.css`),
          cssCode
        );

        vscode.window.showInformationMessage(
          `React component "${folderName}" created successfully!`
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to create component: ${error.message}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
