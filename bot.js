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
  await interaction.reply({
      content:"You nominated: " + interaction.options.getMember("member").displayName,
      ephemeral:true,
  }).then(async () => {
    const thread = await interaction.channel.threads.create({
      name: 'Nominated: ' + interaction.options.getMember("member").displayName,
      autoArchiveDuration: 60,
	  reason: 'Thread for voting on member promotion',
  });
  return thread
  }).then(async (thread) => {
    const poll = Discord.PollData ={
      question: {
        text: "Should " + interaction.options.getMember("member").displayName + " be promoted?",
    },
    answers: [
        {
            text: 'Yes',
            emoji: "💪",
        },
        {
            text: 'No',
            emoji: "📉",
        },
    ],
    duration: 336, // 2 Weeks
    allowMultiselect: false,
    layoutType: Discord.PollLayoutType.Default, // Single type (optional)
    }
    await thread.members.add(interaction.user)
    await thread.send(
      {
        content:"",
        poll:poll
      })
  }
  )

  // const player = await interaction.options.getMember("member").displayName
  // const question = await "Should the nominated player be promoted?"
  // const answers = await [{1:"Yes"},{2:"No"}]
  // const nomPoll = await new Discord.Poll(client,{
  // player,
  // question: question,
  // answers: answers,
  // expiresTimestamp: 1000000,
  // allowMultiselect:false,
  // layoutType:1}
  }
  }
});

client.login(process.env.BOT_TOKEN);


BOT_PREFIX = "/"
NOMINATE_COMMAND = "nominate"
