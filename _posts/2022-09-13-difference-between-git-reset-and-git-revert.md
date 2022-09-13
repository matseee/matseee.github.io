---
layout: post
title:  "Whats the difference between git reset and git revert"
date: 2022-09-13 23:35:00 +0200
categories: ["Programming"]
---
If a commit was created by mistake and you want to revert it, you are faced with the choice of the `git reset` and `git revert` command. Now the question arises, which command should be used for which application and what do they do at all?

#### TLDR
- `git reset`: use it when you want to reset the complete history state of the commit `e2527a6`:
    ```bash
    git log --oneline --decorate --graph
    git reset --hard e2527a6
    git clean -f -d                       // this deletes uncommited files!!
    git push origin +main
    ```
- `git revert`: use it when you only want to revert the changes of one commit by creating a new commit with the reverse changes:
    ```bash
    git log --oneline --decorate --graph
    git revert 32527a6 --no-edit
    ```

## git reset
Can be used when the state of a past commit needs to be restored. All subsequent changes are removed with this command. First you need to get the commit hash value of the last "right" commit. With the command `git log` the required commit hash value can be determined:
```bash
git log --oneline --decorate --graph
...
| * 90961e1 wrong commit
| * 64befc9 wrong commit
| * e2527a6 right commit
| * 49ff10e old commit
| * f12b068 old commit
...
```

Let's assume we want to reset the state of the commit `e2527a6` and at the same time remove the complete subsequent updates from the history. Firstly we use the command `git reset` to set the state of the commit `e2527a6`:
```
git reset --hard e2527a6
```
After that we can delete all changes (also uncommited files) with the command:
```
git clean -f -d
```
In the last step we need to push the current state to a remote git repository like github or gitlab with the `git push` command:
```
git push origin +main
```
The `+` prefix of the remote branch is important. It is used to force the push towards the remote branch, without this `+` prefix the remote repository won't accept the changes.

## git revert
Can be used when the changes of a commit should be rolled back and the subsequent history should still remain. The command creates a new commit with the opposite adjustment of the selected commit. The hash value is also needed for this command, so first the corresponding hash value is selected with the `git log` command.

We assume that the changes of the commit `e2527a6` should be reverted. We can do this with the command `git revert`:
```
git revert e2527a6
```
With the `--no-edit` option a default commit message is chosen, otherwise the editor is opened and the user is prompted to enter a commit message. The created commit can then be pushed to the remote repository as usual.