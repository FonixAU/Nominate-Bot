require("dotenv/config");

const timezoneMap = {
  // US
  PST: "America/Los_Angeles",
  PDT: "America/Los_Angeles",
  MST: "America/Denver",
  MDT: "America/Denver",
  CST: "America/Chicago",
  CDT: "America/Chicago",
  EST: "America/New_York",
  EDT: "America/New_York",

  // UK/EU
  GMT: "Etc/GMT",
  BST: "Europe/London",
  CET: "Europe/Paris",
  CEST: "Europe/Paris",

  // AU/NZ
  AEST: "Australia/Sydney",
  AEDT: "Australia/Sydney",
  ACST: "Australia/Adelaide",
  ACDT: "Australia/Adelaide",
  AWST: "Australia/Perth",
  NZST: "Pacific/Auckland",
  NZDT: "Pacific/Auckland",

  // Asia
  IST: "Asia/Kolkata",
  JST: "Asia/Tokyo",

  // Global
  UTC: "Etc/UTC",
};

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    "Guilds",
    "GuildMessagePolls",
    "GuildMembers",
    "GuildMessages",
    "MessageContent",
  ],
  partials: [Discord.Partials.Message, Discord.Partials.Reaction],
});
const BLANK = "1250623077214191678";
const Member = "1250627277868240936";

//turning bot on
client.on("ready", async () => {
  // console.log(Logged in as ${client.user.tag}!)
  client.user.setPresence({
    activities: [
      {
        type: Discord.ActivityType.Custom,
        name: "custom", // name is exposed through the API but not shown in the client for ActivityType.Custom
        state:"use me so Fox can go broke",
      },
    ],
  });
  console.log("Bot turned on");
});
//minimising LFG clutter
client.on("messageCreate", async (message) => {
  if (message.channel.name.includes("lfg")) {
    if (message.mentions.roles.size > 0) {
      if (
        message.mentions.roles.each((role) => {
          return role.mentionable;
        })
      ) {
        //parse integers
        const regex = /\d{1,2}(?!<)(?!\d)(?!>)/;
        // Test the message and extract the integer if present
        const match = message.content.match(regex);
        // If a match is found, return the integer, otherwise return null
        try {
          if (match) {
            const lfg_count = parseInt(match[0], 10);
            const thread = await message.startThread({
              name:
                message.author.displayName +
                " needs " +
                lfg_count +
                " people for " +
                message.mentions.roles.first().name,
              autoArchiveDuration: 60,
              reason: "Thread for LFGs",
            });
            thread.send("Auto archives after 60min of inactivity");
          } else {
            const thread = await message.startThread({
              name:
                message.author.displayName +
                " needs people for " +
                message.mentions.roles.first().name,
              autoArchiveDuration: 60,
              reason: "Thread for LFGs",
            });
            thread.send("Auto archives after 60min of inactivity");
          }
        } catch (e) {
          console.log(" " + e + " ");
        }
      }
    }
  }
});

client.on("messagePollVoteAdd", async (pollVote, userID) => {
  const poll = await pollVote.poll;
  const total = await poll.answers.reduce(
    (aggregate, answer) => aggregate + answer.voteCount,
    0
  );
  const totalYes = await poll.answers.at(0).voteCount;
  const totalNo = await poll.answers.at(1).voteCount;
  const guild = await client.guilds.cache.get(process.env.GUILD_ID);
  const voter = await guild.members.fetch(userID);
  await guild.members.fetch();
  const splitMessage = await poll.question.text.split(" ", 2);
  const nominee = await (
    await guild.members.search({
      query: splitMessage[1],
      limit: 1,
      cache: true,
    })
  ).at(0);
  try {
    if (poll.question.text.includes("BLANK")) {
      const role = await guild.roles.fetch(BLANK);
      const roleCompare = await voter.roles.highest.comparePositionTo(role);
      if ((await roleCompare) >= 0) {
        if (total / role.members.size >= 0.7) {
          if (total / totalYes >= 0.6) {
            await poll.message
              .reply({
                content: "Successful Promotion: " + nominee.displayName,
                ephemeral: false,
              })
              .then(async () => {
                await nominee.roles.add(role);
              })
              .then(async () => {
                await poll.message.thread.setLocked(true);
                await poll.message.thread.setArchived(true);
                await poll.message.delete();
              });
          } else if (total / totalNo >= 0.6) {
            await poll.message
              .reply({
                content: "Unsuccessful Promotion: " + nominee.displayName,
                ephemeral: false,
              })
              .then(async () => {
                await poll.message.thread.setLocked(true);
                await poll.message.thread.setArchived(true);
                await poll.message.delete();
              });
          }
        }
      }
    } else if (poll.question.text.includes("Member")) {
      const role = await guild.roles.fetch(Member);
      const roleCompare = await voter.roles.highest.comparePositionTo(role);
      if (roleCompare >= 1) {
        await poll.message
          .reply({
            content: voter.nickname + " overwrote this poll's results",
            ephemeral: false,
          })
          .then(async () => {
            if (pollVote.text == "Yes") {
              await nominee.roles.add(role);
            }
          })
          .then(async () => {
            await poll.message.thread.setLocked(true);
            await poll.message.thread.setArchived(true);
            await poll.message.delete();
          });
      } else if ((await roleCompare) >= 0) {
        if (total / role.members.size >= 0.7) {
          if (total / totalYes >= 0.6) {
            await poll.message
              .reply({
                content: "Successful Promotion: " + nominee.displayName,
                ephemeral: false,
              })
              .then(async () => {
                await nominee.roles.add(role);
              })
              .then(async () => {
                await poll.message.thread.setLocked(true);
                await poll.message.thread.setArchived(true);
                await poll.message.delete();
              });
          } else if (total / totalNo >= 0.6) {
            await poll.message
              .reply({
                content: "Unsuccessful Promotion: " + nominee.displayName,
                ephemeral: false,
              })
              .then(async () => {
                await poll.message.thread.setLocked(true);
                await poll.message.thread.setArchived(true);
                await poll.message.delete();
              });
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (
    (await interaction.isCommand()) &&
    (await interaction.commandName) === "nominate"
  ) {
    const roleCompare =
      await interaction.member.roles.highest.comparePositionTo(
        interaction.options.getString("role")
      );
    try {
      const nominee = await interaction.options.getMember("member");
      const role = await interaction.guild.roles.cache.get(
        interaction.options.getString("role")
      );
      const nomineeName = await nominee.displayName;
      const roleName = await role.name;
      const poll = (Discord.PollData = {
        question: {
          text: "Should " + nomineeName + " be promoted to " + roleName + "?",
        },
        answers: [
          {
            text: "Yes",
            emoji: "💪",
          },
          {
            text: "No",
            emoji: "📉",
          },
        ],
        duration: 100, // 100 hours
        allowMultiselect: false,
        layoutType: Discord.PollLayoutType.Default, // Single type (optional)
      });
      if (roleCompare >= 1 && role.id == Member) {
        await interaction
          .reply({
            content: "You promoted: " + nomineeName + " to: " + roleName,
            ephemeral: false,
          })
          .then(async () => {
            nominee.roles.add(role);
          });
      } else if ((await roleCompare) >= 0) {
        await interaction
          .reply({
            content:
              "You nominated: " +
              nomineeName +
              " for promotion to: " +
              roleName,
            ephemeral: true,
          })
          .then(async () => {
            await interaction.channel
              .send({ content: "", poll: poll })
              .then(async (message) => {
                await message.startThread({
                  name: "Nominated: " + nomineeName + " for " + roleName,
                  autoArchiveDuration: 60,
                  reason: "Thread for voting on member promotion",
                });
              });
          });
      } else {
        await interaction.reply({
          content:
            "You cannot nominate someone for a role higher than your own",
          ephemeral: true,
        });
      }
    } catch (error) {
      // console.log(error)
      console.log("double fire");
    }
  }

  if (
    (await interaction.isCommand()) &&
    (await interaction.commandName) === "timestamp"
  ) {
    const time = interaction.options.getString('time');
    const date = interaction.options.getString('date');
    const tzAbbr = interaction.options.getString('tz');
    const tzFull = interaction.options.getString('timezone');
    var zone;
    if(tzAbbr){zone = timezoneMap[tzAbbr.trim()?.toUpperCase()]}
    else if(tzFull){zone = tzFull.trim()}

    if (!zone) {
      await interaction.reply({
        content: `❌ Please provide a valid \`tz\` (abbreviation) or \`timezone\` (e.g. America/New_York).`,
        ephemeral: true,
      });
      return;
    }

    const [hour, minute] = time.split(":").map(Number);
    const [year, month, day] = date.split("-").map(Number);

    const dt = DateTime.fromObject(
      { year, month, day, hour, minute },
      { zone }
    );

    if (!dt.isValid) {
      await interaction.reply({
        content: `❌ Invalid date, time, or timezone. Make sure you're using 24-hour format and a supported timezone.`,
        ephemeral: true,
      });
      return;
    }

    const unix = Math.floor(dt.toSeconds());
    await interaction.reply({
      content: `🕒 Here's your timestamp: <t:${unix}:F>, (<t:${unix}:R>)`,
      ephemeral: false,
    });
  }
});

client.login(process.env.BOT_TOKEN);

// Testing member caching
// const guild = await client.guilds.fetch(process.env.GUILD_ID)
// await guild.members.fetch()
// const role = await guild.roles.fetch(BLANK)
// console.log(role.members.size)
