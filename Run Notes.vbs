Option Explicit

Dim shell, fileSystem, projectFolder, command

Set shell = CreateObject("WScript.Shell")
Set fileSystem = CreateObject("Scripting.FileSystemObject")

projectFolder = fileSystem.GetParentFolderName(WScript.ScriptFullName)
command = "cmd /c cd /d """ & projectFolder & """ && py app.py"

shell.Run command, 0, False
