import * as vscode from 'vscode'
import { git } from '../git'

type StatusFile = {
  path: string
  index: string
  working_dir: string
}

type ExtraQuickPickItem = vscode.QuickPickItem & {
  file: StatusFile
}

export async function stage() {
  const status = await git.status()

  const isStaged = (file: StatusFile) => {
    if (file.index.trim() !== '' && file.index.trim() !== '?') return true
    if (status.staged.includes(file.path)) return true
    if (status.created.includes(file.path)) return true

    return false
  }

  const quickPickItems: ExtraQuickPickItem[] = status.files.map(file => ({
    label: file.path,
    picked: isStaged(file),
    description: file.index + file.working_dir,
    file: file
  }))

  const selectedItems = await vscode.window.showQuickPick(quickPickItems, {
    canPickMany: true,
    placeHolder: 'Use <Space> to select files and <Enter> to apply'
  })

  if (selectedItems === undefined) return

  const cleanEntries = (file: StatusFile) => {
    if (file.index === 'R') {
      const renamedFile = status.renamed.find(rf =>
        file.path.startsWith(rf.from)
      )

      if (!renamedFile) return file
      return { ...file, path: renamedFile.to }
    }

    return file
  }

  const stageItems = selectedItems.map(item => item.file).map(cleanEntries)
  const resetItems = status.files
    .map(cleanEntries)
    .filter(file => !stageItems.map(({ path }) => path).includes(file.path))

  const pathsToStage = stageItems
    .filter(file => file.index !== 'D')
    .map(file => file.path)
  const pathsToReset = resetItems.map(file => file.path)

  if (pathsToStage.length > 0) await git.add(pathsToStage)
  if (pathsToReset.length > 0) await git.reset(['HEAD', '--', ...pathsToReset])
}
