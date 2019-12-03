import * as vscode from "vscode";
import * as simplegit from "simple-git/promise";

export async function activate(context: vscode.ExtensionContext) {
  const git = simplegit(vscode.workspace.rootPath); // TODO: rootPath is deprecated
  const { registerCommand } = vscode.commands;

  let disposable = registerCommand("gitNotch.stage", async () => {
    const status: simplegit.StatusResult = await git.status();
    const quickPickItems: vscode.QuickPickItem[] = status.files.map(file => ({
      label: file.path,
      picked: status.staged.includes(file.path),
      description: file.working_dir
    }));

    const selectedItems = await vscode.window.showQuickPick(quickPickItems, {
      canPickMany: true
    });

    if (selectedItems === undefined) return;

    const pathsToStage = [...new Set(selectedItems.map(item => item.label))];
    const pathsToUnstage = [
      ...new Set(
        status.files
          .filter(file => !pathsToStage.includes(file.path))
          .map(file => file.path)
      )
    ];

    await Promise.all([git.add(pathsToStage), git.reset(pathsToUnstage)]);
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
