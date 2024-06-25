require('dotenv/config')

const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['Guilds','GuildMessagePolls']})
const BLANK = '1250623077214191678'
const Member = '1250627277868240936'

client.on('ready', () => {
  // console.log(`Logged in as ${client.user.tag}!`)
  console.log('Bot turned on')
});

client.on('messagePollVoteAdd', async (pollVote,userID) => {
  const poll = await pollVote.poll
  const total = await poll.answers.reduce((aggregate,answer)=> aggregate + answer.voteCount,0)
  const totalYes = await poll.answers.at(0).voteCount
  const totalNo = await poll.answers.at(1).voteCount
  const guild = await client.guilds.cache.get(process.env.GUILD_ID)
  const gmember = await guild.members.fetch(userID)
  console.log(totalYes)
  try{
  if(poll.question.text.includes("BLANK")){
    const role = await guild.roles.cache.get(BLANK)
    const roleCompare = await gmember.roles.highest.comparePositionTo(role);
    if(roleCompare >=1){
      await poll.message.reply({
        content:"You overwrote this poll's results",
        ephemeral:false,
    }).then(async () => {
      nominee.roles.add(role)
    }).then(async () => {
      poll.message.delete()
    })
    }
    else 
    if(await roleCompare >= 0){
      if(total / role.members.size >= 0.7){
        if(total / totalYes >= 0.6){
          poll.message.delete()
        }
        if(total / totalNo >= 0.6){
        
        }
      }
      console.log(role.members.size)

    }
  }else if(poll.question.text.includes("Member")){
    const role = await guild.roles.cache.get(Member)
    const roleCompare = await gmember.roles.highest.comparePositionTo(role);
    if(roleCompare >=1){
      await interaction.reply({
        content:"You promoted: " + nomineeName + " to: " + roleName,
        ephemeral:false,
    }).then(async () => {
      nominee.roles.add(role)
    })}
    else 
    if(await roleCompare >= 0){
      if(total / role.members.size >= 0.5){

      }
      console.log(role.members.size)

    }


  }
  }catch(e){
    console.log(e)
  }
  console.log(total)
  // const voters = await pollVote.fetchVoters()
  
  
  // await poll.answers.each(answer =>{
  //   const count = answer.voteCount
  //   console.log(count)
  // })
  
})

client.on('interactionCreate', async (interaction) =>{
  if(await interaction.isCommand() && await interaction.commandName === "nominate"){
    const roleCompare = await interaction.member.roles.highest.comparePositionTo(interaction.options.getString("role"));
    try {
    const nominee = await interaction.options.getMember("member")
    const role = await interaction.guild.roles.cache.get(interaction.options.getString("role"))
    const nomineeName = await nominee.displayName
    const roleName = await role.name
    // if(roleCompare >=1){
    //   await interaction.reply({
    //     content:"You promoted: " + nomineeName + " to: " + roleName,
    //     ephemeral:false,
    // }).then(async () => {
    //   nominee.roles.add(role)
    // })}
    // else 
    if(await roleCompare >= 0){
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
      duration: 1, // 100 hours
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
      console.log("Thread + Poll Created")
  }
  else{
    await interaction.reply({
      content:"You cannot nominate someone for a role higher than your own",
      ephemeral:true,
  })
  }
  }catch(error){
    console.log(error)
  }
  }}
  );

client.login(process.env.BOT_TOKEN);


BOT_PREFIX = "/"
NOMINATE_COMMAND = "nominate"
