import * as fs from 'fs'
import * as vscode from 'vscode'
import { git, getFullPath } from '../git'
import { resolve } from 'dns'

const editmsgRelativePath = '.git/COMMIT_EDITMSG'
const scissors = '------------------------ >8 ------------------------'

export async function commit() {
  try {
    await ensureCommitable()
  } catch (error) {
    vscode.window.setStatusBarMessage(error.message, 3000)
    return
  }

  const editmsgPath = await getFullPath(editmsgRelativePath)

  await writeFile(editmsgPath, await getTemplate())
  await openFile(editmsgPath)
  await waitForClose()
  const editmsgContent = await readFile(editmsgPath)
  const contentAboveScissors = await cleanupEditmsg(editmsgContent)
  await writeFile(editmsgPath, contentAboveScissors)

  try {
    await git.raw(['commit', '--cleanup=strip', `--file=${editmsgPath}`])
  } catch (error) {
    if (error.message.includes('empty commit message')) {
      vscode.window.setStatusBarMessage(error.message, 3000)
    } else {
      vscode.window.showErrorMessage(error.message)
    }
  }
}

async function ensureCommitable(): Promise<void> {
  const diff = await git.raw(['diff-index', '--cached', 'HEAD', '--'])
  if (diff === null) {
    throw new Error('Nothing to commit.')
  }
  return
}

async function getTemplate(): Promise<string> {
  const commentChar = await getCommentChar()
  const status = await git.raw(['-c', 'color.ui=false', 'status'])
  const diff = await git.raw(['diff', '--color=never', '--staged'])
  const commentedStatus = status
    .replace(/\s*\(.*\)\n/g, '\n')
    .trim()
    .replace(/\n/g, `\n${commentChar} `)

  return `
${commentChar} Please enter the commit message for your changes. Lines starting
${commentChar} with '${commentChar}' will be ignored, and an empty message aborts the commit.
${commentChar}
${commentChar} ${commentedStatus}
${commentChar}
${commentChar} ${scissors}
${commentChar} Do not modify or remove the line above.
${commentChar} Everything below it will be ignored.
${diff}
`
}

async function getCommentChar(): Promise<string> {
  try {
    const commentChar = await git.raw(['config', '--get', 'core.commentChar'])
    return commentChar || '#'
  } catch (_error) {
    return '#'
  }
}

async function writeFile(path: string, text: string): Promise<void> {
  await fs.promises.writeFile(path, text)
}

async function readFile(path: string): Promise<string> {
  const contents = await fs.promises.readFile(path, { encoding: 'utf8' })
  return contents
}

async function openFile(path: string): Promise<void> {
  const document = await vscode.workspace.openTextDocument(path)
  const editor = await vscode.window.showTextDocument(document)

  // It happens quite often that after showing the text document, the cursor is
  // positioned in the middle or at the end of the document. Waiting a bit and
  // positioning the cursor at the start seems to help. Maybe my arbitrary
  // 100ms are prone to bugs, who knows.
  return new Promise(resolve => {
    setTimeout(() => {
      editor.selection = new vscode.Selection(0, 0, 0, 0)
      editor.revealRange(new vscode.Range(0, 0, 0, 0))
      resolve()
    }, 100)
  })
}

async function waitForClose(): Promise<void> {
  return new Promise(resolve => {
    const watcher = vscode.workspace.onDidCloseTextDocument(closedDocument => {
      if (closedDocument.fileName.includes(editmsgRelativePath)) {
        watcher.dispose()
        return resolve()
      }
    })
  })
}

async function cleanupEditmsg(text: string): Promise<string> {
  const commentChar = await getCommentChar()
  const [contentAboveScissors] = text.split(`${commentChar} ${scissors}`)
  return contentAboveScissors.trim()
}
