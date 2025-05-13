require('dotenv/config')
const {REST, Routes, SlashCommandBuilder } = require('discord.js')
//info needed to create slash comands
const botID= "1250664869859168266"
const serverID = process.env.GUILD_ID
const botToken = process.env.BOT_TOKEN

const rest = new REST().setToken(botToken)
const commandRegister = async () => {
    try {
        //clear all commands to avoid duplicates
        await rest.put(Routes.applicationGuildCommands(botID, serverID), { body: [] })
        .then(() => console.log('Successfully deleted all commands.'))
        .catch(console.error);

        //when done for multi-server registration do:
        //await rest.put(Routes.applicationCommands(botID)

        await rest.put(Routes.applicationGuildCommands(botID,serverID),
        {
        body: [
            new SlashCommandBuilder()
            .setName("nominate")
            .setDescription("This command nominates a player for promotion")
            .addUserOption(option => { 
                return option
                .setName("member")
                .setDescription("The member to be nominated")
                .setRequired(true)})
            .addStringOption(option =>
                option.setName('role')
                    .setDescription('Role for promotion')
                    .setRequired(true)
                    .addChoices(
                        { name: 'BLANK', value: '1250623077214191678' },
                        { name: 'Member', value: '1250627277868240936' },
                    )),
            new SlashCommandBuilder()        
            .setName("timestamp")
                .setDescription("Generate a Discord timestamp from time and date")
                .addStringOption(option =>
                      option
                        .setName("time")
                        .setDescription("Time in HH:MM (24-hour)")
                        .setRequired(true)
                    )
                    .addStringOption(option =>
                      option
                        .setName("date")
                        .setDescription("Date in YYYY-MM-DD format")
                        .setRequired(true)
                    ),
            ]
        }
    )
        
        console.log("Successfully registered application commands")
    }catch(error) {
        console.error(error)
    }
}

commandRegister();