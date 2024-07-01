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
  const voter = await guild.members.fetch(userID)
  const splitMessage = await poll.question.text.split(" ",2)
  const nominee = await (await guild.members.search({query:splitMessage[1],limit:1,cache:true})).at(0)
  try{
  if(poll.question.text.includes("BLANK")){
    const role = await guild.roles.cache.get(BLANK)
    const roleCompare = await voter.roles.highest.comparePositionTo(role);
    // if(roleCompare >=1){
    //   await poll.message.reply({
    //     content:voter.displayName + " overwrote this poll's results",
    //     ephemeral:false,
    // }).then(async () => {
    //  if(pollVote.text == "Yes"){}
    //   await nominee.roles.add(role)}
    //  
    // }).then(async () => {
    //   await poll.message.thread.setLocked(true)
    //   await poll.message.thread.setArchived(true)
    //   await poll.message.delete()
    // })
    // }
    // else
    if(await roleCompare >= 0){
      if(total / role.members.size >= 0.7){
        if(total / totalYes >= 0.6){
          await poll.message.reply({
            content:"Successful Promotion: " + nominee.displayName,
            ephemeral:false,
        }).then(async () => {
          await nominee.roles.add(role)
        }).then(async () => {
          await poll.message.thread.setLocked(true)
          await poll.message.thread.setArchived(true)
          await poll.message.delete()
        })
        }else
        if(total / totalNo >= 0.6){
          await poll.message.reply({
            content:"Unsuccessful Promotion: " + nominee.displayName,
            ephemeral:false,
        }).then(async () => {
          await poll.message.thread.setLocked(true)
          await poll.message.thread.setArchived(true)
          await poll.message.delete()
        })
        }
      }
    }
  }else if(poll.question.text.includes("Member")){
    const role = await guild.roles.cache.get(Member)
    const roleCompare = await voter.roles.highest.comparePositionTo(role);
    if(roleCompare >=1){
      await poll.message.reply({
        content:voter.nickname + " overwrote this poll's results",
        ephemeral:false,
    }).then(async () => {
      if(pollVote.text == "Yes"){
      await nominee.roles.add(role)}
    }).then(async () => {
      await poll.message.thread.setLocked(true)
      await poll.message.thread.setArchived(true)
      await poll.message.delete()
    })
    }else
    if(await roleCompare >= 0){
      if(total / role.members.size >= 0.7){
        if(total / totalYes >= 0.6){
          await poll.message.reply({
            content:"Successful Promotion: " + nominee.displayName,
            ephemeral:false,
        }).then(async () => {
          await nominee.roles.add(role)
        }).then(async () => {
          await poll.message.thread.setLocked(true)
          await poll.message.thread.setArchived(true)
          await poll.message.delete()
        })
        }else
        if(total / totalNo >= 0.6){
          await poll.message.reply({
            content:"Unsuccessful Promotion: " + nominee.displayName,
            ephemeral:false,
        }).then(async () => {
          await poll.message.thread.setLocked(true)
          await poll.message.thread.setArchived(true)
          await poll.message.delete()
        })
        }
      }
    }
  }
  }catch(e){
    console.log(e)
  }  
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand() && interaction.commandName === 'nominate') {
    const roleCompare = await interaction.member.roles.highest.comparePositionTo(interaction.options.getString('role'));
    try {
      const nominee = await interaction.options.getMember('member');
      const role = await interaction.guild.roles.cache.get(interaction.options.getString('role'));
      const nomineeName = await nominee.displayName;
      const roleName = await role.name;

      const poll = {
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
        layoutType: 'DEFAULT', // Single type (optional)
      };

      if(roleCompare >= 1 && role.id == Member) {
        await interaction.reply({
          content: "You promoted: " + nomineeName + " to: " + roleName,
          ephemeral: false,
        }).then(async () => {
          nominee.roles.add(role);
        });
      } else 
      if (roleCompare >= 0) {
        await interaction.reply({
          content: "You nominated: " + nomineeName + " for promotion to: " + roleName,
          ephemeral: true,
        }).then(async () => {
          await interaction.channel.send({
            content: "",
            embeds: [poll]
          }).then(async (message) => {
            await message.startThread({
              name: 'Nominated: ' + nomineeName + ' for ' + roleName,
              autoArchiveDuration: 60,
              reason: 'Thread for voting on member promotion',
            });
          });
        });
      } else {
        await interaction.reply({
          content: "You cannot nominate someone for a role higher than your own",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
});

client.login(process.env.BOT_TOKEN);




