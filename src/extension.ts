import * as vscode from 'vscode'
import * as cmd from './cmds'
import * as git from './git'

export async function activate(context: vscode.ExtensionContext) {
  await git.setup()
  const { registerCommand } = vscode.commands

  let disposable = registerCommand('gitNotch.stage', async () => {
    await cmd.stage()
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
