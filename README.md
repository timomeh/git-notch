# git-notch

**[Install](vscode:extension/timomeh.git-notch) | [View on GitHub](https://github.com/timomeh/git-notch) | [View on Marketplace](https://marketplace.visualstudio.com/items?itemName=timomeh.git-notch)**

Better Git tools through the Command Palette without touching your mouse.

## Command Palette

- **Git Notch: Stage** – Opens a quick picker with unstaged changes and untracked files. You can select or deselect multiple files to stage changes.
- **Git Notch: Commit** – Opens the `COMMIT_EDITMSG` to enter a commit message with commit details below. Safe and close the file to commit.
- **Git Notch: Commit Amend** – Same as _Git Notch: Commit_, but amends the last commit. (Adds staged files to last commit and change the commit message.)
- **Git Notch: Commit Amend (no edit)** – Amend the commit without changing the commit message. (Adds staged files to the last commit.)

## Command Reference

- `gitNotch.stage`
- `gitNotch.commit`
- `gitNotch.commit-amend`
- `gitNotch.commit-amend-no-edit`

## Keybindings

This extension doesn't define any keybindings. I think keyboard shortcuts are a personal preference. Also it's hard to find comfortable shortcuts which won't collide with VS Code's own shortcuts or shortcuts from popular extensions.

## Background

I really like Atom's [git-plus](https://github.com/akonwi/git-plus) extension. Now I've switched to VS Code, and I really miss it. git-plus has baked itself into my workflow, and I love that I can do all my common git tasks without touching my mouse or leaving my editor. So I had to rebuild it.

I don't aim to rebuild all features of git-plus because I haven't used all of them. But contributions are welcome.

Props to [Akonwi Ngoh](https://github.com/akonwi) for creating git-plus.

## Contribute

1. Clone it
2. Run `npm install`
3. Open a terminal and run `npm run dev`
4. Open the project in VS Code and press `F5`

## License

MIT freundlichen Grüßen (c) 2019 Timo Mämecke
