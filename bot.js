require('dotenv/config')
const botID= "1250664869859168266"

const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['Guilds']})

client.on('ready', () => {
  // console.log(`Logged in as ${client.user.tag}!`)
  console.log('Bot turned on')
});

client.on("interactionCreate", async (interaction) =>{
  if(interaction.isCommand()){
  if(interaction.commandName === "nominate")
  {
    // ephemeral: true makes it so only user can see it
    interaction.reply(
    {
      content:"You nominated: " + interaction.options.getMember("member").displayName,
      ephemeral:true
    })
  const thread = await interaction.channel.threads.create({
      name: 'Nominated: ' + interaction.options.getMember("member").displayName,
      autoArchiveDuration: 60,
	  reason: 'Thread for voting on member promotion',
  });
  const pqm = PollQuestionMedia(
    "Should "+ interaction.options.getMember("member").displayName+ " be promoted?"
  )
  const answers = [{1:"Yes"},{2:"No"}]
  const nomPoll = await Discord.Poll(
    'Nominated: ' + interaction.options.getMember("member").displayName,
  pqm,
  answers,
  1000000,
  false,
  1,
  false,
  end("Promoted")
  )
 
  await thread.send(
    {
      content:nomPoll,
    })
  await thread.members.add(interaction.options.getMember("member"))
  }
  }
});

client.login(process.env.BOT_TOKEN);


BOT_PREFIX = "/"
NOMINATE_COMMAND = "nominate"
