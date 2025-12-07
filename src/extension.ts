import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // DEBUG
  // console.log("Symlink extension activated");
  // vscode.window.showInformationMessage("Symlink extension is running");

  // vscode.workspace.onDidOpenTextDocument(doc => {
  //   console.log("Opened file:", doc.fileName);
  // });
  // DEBUG END
  
  // Intercept document open
  const disposable = vscode.workspace.onDidOpenTextDocument(doc => {
    try {
      const filePath = doc.fileName;
      if (!fs.existsSync(filePath)) {
        // Skip if file does not exist
        return;
      }
      const stat = fs.lstatSync(filePath);
      if (stat.isSymbolicLink()) {
        const target = fs.readlinkSync(filePath);
        const resolved = path.resolve(path.dirname(filePath), target);
        vscode.workspace.openTextDocument(resolved).then(targetDoc => {
          vscode.window.showTextDocument(targetDoc);
        });
      }
    } catch (err) {
      console.error('Symlink resolution failed:', err);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

