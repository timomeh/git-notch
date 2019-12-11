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

  subscriptions.push(
    registerCommand('gitNotch.commit-amend', async () => {
      await cmd.commit({ amend: true })
    })
  )

  subscriptions.push(
    registerCommand('gitNotch.commit-amend-no-edit', async () => {
      await cmd.commit({ amend: true, noEdit: true })
    })
  )
}

export function deactivate() {}
