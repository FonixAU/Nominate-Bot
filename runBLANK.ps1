# Run commands.js using Node.js
Write-Host "Running commands.js..."
node commands.js

# Check if the previous command was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "commands.js executed successfully. Starting bot.js..."
    
    # Run npm start for bot.js
    npm run start
} else {
    Write-Host "commands.js failed to execute. Aborting."
}