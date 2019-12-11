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
  const disposable = vscode.window.onDidChangeActiveTextEditor(editor => {
    if (!editor) return

    const { fileName } = editor.document
    if (fileName.includes(path.join('.git', 'COMMIT_EDITMSG'))) {
      editor.selection = new vscode.Selection(0, 0, 0, 0)
      editor.revealRange(new vscode.Range(0, 0, 0, 0))
      disposable.dispose()
    }
  })

  try {
    const out = await git.raw(args)
    vscode.window.showInformationMessage(out)
  } catch (error) {
    vscode.window.showErrorMessage(error.message)
  } finally {
    disposable.dispose()
  }
}
