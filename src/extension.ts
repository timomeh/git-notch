import * as vscode from 'vscode'
import * as cmd from './cmds'
import * as git from './git'

export async function activate(context: vscode.ExtensionContext) {
  await git.setup()
  const { registerCommand } = vscode.commands
  const { subscriptions } = context

  subscriptions.push(
    registerCommand('gitNotch.stage', async () => {
      await cmd.stage()
    })
  )

  subscriptions.push(
    registerCommand('gitNotch.commit', async () => {
      await cmd.commit()
    })
  )
}

export function deactivate() {}
