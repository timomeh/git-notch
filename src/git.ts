import * as simplegit from 'simple-git/promise'
import * as vscode from 'vscode'

let git: simplegit.SimpleGit

export async function setup() {
  const { rootPath } = vscode.workspace

  if (rootPath === undefined) {
    throw new Error('No directory open')
  }

  git = simplegit(vscode.workspace.rootPath)

  if ((await git.checkIsRepo()) === false) {
    throw new Error('No git root detected')
  }
}

export { git }

export async function getFullPath(appendPath: string): Promise<string> {
  const rootPath = await git.revparse(['--show-toplevel'])
  return rootPath + '/' + appendPath
}
