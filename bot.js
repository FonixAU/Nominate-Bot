require('dotenv/config')
const botID= "1250664869859168266"

const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['Guilds']})

client.on('ready', () => {
  // console.log(`Logged in as ${client.user.tag}!`)
  console.log('Bot turned on')
});

client.on("interactionCreate", async (interaction) =>{
  if(interaction.isCommand() && interaction.commandName === "nominate"){
    const roleCompare = await interaction.member.roles.highest.comparePositionTo(interaction.options.getString("role"));
    try {
    const nominee = interaction.options.getMember("member")
    const role = interaction.guild.roles.cache.get(interaction.options.getString("role"))
    const nomineeName = interaction.options.getMember("member").displayName
    const roleName = interaction.guild.roles.cache.get(interaction.options.getString("role")).name
    if(roleCompare >=1){
      await interaction.reply({
        content:"You promoted: " + nomineeName + " to: " + roleName,
        ephemeral:false,
    }).then(async () => {
      nominee.roles.add(role)
    })}
    else if(roleCompare >= 0){
   
      await interaction.reply({
        content:"You nominated: " + nomineeName + " for promotion to: " + roleName,
        ephemeral:true,
    }).then(async () => {
    const thread = await interaction.channel.threads.create({
        name: 'Nominated: ' + nomineeName + ' for ' + roleName,
        autoArchiveDuration: 60,
      reason: 'Thread for voting on member promotion',
    });
    return thread
    }).then(async (thread) => {
      const poll = Discord.PollData ={
        question: {
          text: "Should " + nomineeName + " be promoted to " + roleName + "?",
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
      duration: 100, // 100 hours
      allowMultiselect: false,
      layoutType: Discord.PollLayoutType.Default, // Single type (optional)
      }
      await thread.members.add(interaction.user)
      await thread.send(
        {
          content:"",
          poll:poll
        })
      })
  }
  else{
    await interaction.reply({
      content:"You cannot nominate someone for a role higher than your own",
      ephemeral:true,
  })
  }
  } catch (error) {
    console.error(error)
  }}
  });

client.login(process.env.BOT_TOKEN);


BOT_PREFIX = "/"
NOMINATE_COMMAND = "nominate"
