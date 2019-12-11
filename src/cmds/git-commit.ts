import * as path from 'path'
import * as vscode from 'vscode'
import { git } from '../git'

type CommitOptions = {
  amend?: boolean
  noEdit?: boolean
}

export async function commit(opts: CommitOptions = {}) {
  const config = vscode.workspace.getConfiguration('gitNotch.commit')
  const args = ['commit']

  if (config.get('verboseCommits')) args.push('--verbose')
  if (opts.amend) args.push('--amend')
  if (opts.noEdit) args.push('--no-edit')

  // Move cursor to the start of COMMIT_EDITMSG when it opens
  const didOpen = vscode.window.onDidChangeActiveTextEditor(editor => {
    if (!editor) return

    if (isCommitEditmsg(editor.document)) {
      editor.selection = new vscode.Selection(0, 0, 0, 0)
      editor.revealRange(new vscode.Range(0, 0, 0, 0))
      didOpen.dispose()
    }
  })

  // Autoclose on save
  const didSave = vscode.workspace.onDidSaveTextDocument(document => {
    if (!config.get('closeOnSave')) return

    if (isCommitEditmsg(document)) {
      vscode.commands.executeCommand('workbench.action.closeActiveEditor')
      didSave.dispose()
    }
  })

  try {
    const out = await git.raw(args)

    vscode.window.setStatusBarMessage('git $(check)', 2000)
    if (config.get('showSuccessInformationMessage')) {
      vscode.window.showInformationMessage(out)
    }
  } catch (error) {
    vscode.window.showErrorMessage(error.message)
  } finally {
    didOpen.dispose()
    didSave.dispose()
  }
}

function isCommitEditmsg(document: vscode.TextDocument) {
  return document.fileName.includes(path.join('.git', 'COMMIT_EDITMSG'))
}
