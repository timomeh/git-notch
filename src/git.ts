import * as path from 'path'
import * as simplegit from 'simple-git/promise'
import * as vscode from 'vscode'

let git: simplegit.SimpleGit

export async function setup() {
  const { rootPath } = vscode.workspace

  if (rootPath === undefined) {
    throw new Error('No directory open')
  }

  const GIT_EDITOR = path
    .join(vscode.env.appRoot, '/bin/code')
    .replace(/(\s+)/g, '\\$1')
    .concat(' --wait')

  git = simplegit(vscode.workspace.rootPath)
  git = git.env({ ...process.env, GIT_EDITOR })

  if ((await git.checkIsRepo()) === false) {
    throw new Error('No git root detected')
  }
}

export { git }

export async function getFullPath(appendPath: string): Promise<string> {
  const rootPath = await git.revparse(['--show-toplevel'])
  return rootPath + '/' + appendPath
}
