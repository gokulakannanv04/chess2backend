# Get the directory where the script is located
$scriptDir = $PSScriptRoot

# Change to the project directory
cd $scriptDir

# Add all changes to the staging area
git add .
# git rm --cached upload.ps1
# Commit the changes with a commit message
git commit -m "Automated commit - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Push changes to the remote repository (assuming 'origin' is your remote and 'main' is your branch)
git push origin master
