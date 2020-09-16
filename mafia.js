const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs')

let rawdata = fs.readFileSync('mafiaData.json');
let data = JSON.parse(rawdata);
let player_data = data["player_data"];
let game_data = data["game_data"];
let role_list = data["role_list"];

let role_pages = []
let all_role_pages = []

let response = "";

const TOKEN = 'NzA0NjgyNTc4OTIxMjU5MTc4.XqhyJQ.LkfPGSB8_3ObzxDHQEcvQW-31EI';
let nameCollector;
const PREFIX = "m!";


client.on('ready', () => {
    for (role in role_list){
        rdata = role_list[role]

        all_role_pages.push([rdata["name"], rdata["description"], rdata["team"], rdata["unique"]])

        if (rdata["active"] != 1)
        {
            continue;
        }

        role_pages.push([rdata["name"], rdata["description"], rdata["team"], rdata["unique"]])
    }

    console.log(`Logged in as ${client.user.tag} and ready to go!`);
});

client.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.startsWith(PREFIX)) {

        let args = message.content.slice(PREFIX.length).split(' ');
        const command = args.shift().toLowerCase(); //Cuts first element from args

        switch(command) {

            case "rolelist":
            case "roles":
                let page = 1;
                let pages = role_pages

                if (args.includes("-all")) {
                    pages = all_role_pages
                }
                if (args.includes("-list")){
                    let response = "List of roles is:"
                    for (p in pages){
                        response += "\n  -" + pages[p][0]
                    }
                    message.channel.send(response);
                    return;
                }

                let t_pages = []
                if (args.includes("-town") || args.includes("-t")){
                    for (p in pages){
                        if (pages[p][2] === 0) {
                            t_pages.push(pages[p])
                        }                        
                    }
                    pages = t_pages;
                }
                else if (args.includes("-mafia") || args.includes("-m")){
                    for (p in pages){
                        if (pages[p][2] === 1) {
                            t_pages.push(pages[p])
                        }                        
                    }
                    pages = t_pages;
                }
                else if (args.includes("-outsider") || args.includes("-o")){
                    for (p in pages){
                        if (pages[p][2] === 3) {
                            t_pages.push(pages[p])
                        }                        
                    }
                    pages = t_pages;
                }
                else if (args.includes("-neutral") || args.includes("-n")){
                    for (p in pages){                        
                        if (pages[p][2] === 2) {
                            t_pages.push(pages[p])
                        }                        
                    }
                    pages = t_pages;
                }

                const embed = new Discord.MessageEmbed()
                    .setFooter("Role " + page + " of " + pages.length)
                    .setTitle(pages[page-1][0])
                    .setDescription(pages[page-1][1])

                switch(pages[page-1][2]) {
                    case 0:
                        embed.setColor(0x12ef12);
                        break;
                    case 1:
                        embed.setColor(0xef1212);
                        break;
                    case 2:
                        embed.setColor(0xefefef);
                        break;
                    case 3:
                        embed.setColor(0x1212ef);
                        break;
                }
                
                message.channel.send(embed).then(msg => {
                    msg.react("◀️").then(() =>{
                        msg.react("▶️")

                        const stepBackward = (reaction, user) => reaction.emoji.name === "◀️" && user.id === message.author.id;
                        const stepForward = (reaction, user) => reaction.emoji.name === "▶️" && user.id === message.author.id;
                        
                        const backwards = msg.createReactionCollector(stepBackward, {time: 120000});
                        const forwards = msg.createReactionCollector(stepForward, {time: 120000});

                        backwards.on("collect", r => {
                            page--;
                            if (page === 0) page = pages.length;
                            embed.setFooter("Role " + page + " of " + pages.length)
                            if(pages[page - 1][3] === 0) {
                                embed.setTitle(pages[page-1][0])
                            }
                            else {
                                embed.setTitle("***" + pages[page-1][0] + "***")
                            }
                            embed.setDescription(pages[page-1][1])
                            switch(pages[page-1][2]) {
                                case 0:
                                    embed.setColor(0x12ef12);
                                    break;
                                case 1:
                                    embed.setColor(0xef1212);
                                    break;
                                case 2:
                                    embed.setColor(0xefefef);
                                    break;
                                case 3:
                                    embed.setColor(0x1212ef);
                                    break;
                            }
                            msg.edit(embed);


                            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                            try {
                                for (const reaction of userReactions.values()) {
                                    reaction.users.remove(message.author.id);
                                }
                            } catch (error) {
                                console.log("ERROR::")
                                console.log(error)
                            }
                        })

                        forwards.on("collect", () => {
                            page++;
                            if (page > pages.length) page = 1;
                            embed.setFooter("Role " + page + " of " + pages.length)
                            if(pages[page - 1][3] === 0) {
                                embed.setTitle(pages[page-1][0])
                            }
                            else {
                                embed.setTitle("***" + pages[page-1][0] + "***")
                            }
                            embed.setDescription(pages[page-1][1])
                            switch(pages[page-1][2]) {
                                case 0:
                                    embed.setColor(0x12ef12);
                                    break;
                                case 1:
                                    embed.setColor(0xef1212);
                                    break;
                                case 2:
                                    embed.setColor(0xefefef);
                                    break;
                                case 3:
                                    embed.setColor(0x1212ef);
                                    break;
                            }
                            msg.edit(embed);       
                            
                            
                            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                            try {
                                for (const reaction of userReactions.values()) {
                                    reaction.users.remove(message.author.id);
                                }
                            } catch (error) {
                                console.log("ERROR::")
                                console.log(error)
                            }
                        })
                    })
                })
                return;

            case "role":
                const indv_data = player_data[message.author.id.toString()]

                if(!indv_data) {
                    message.reply("You don't appear to be playing in this game. To join the next game, type \"m!join\"")
                    console.log(message.author.id)
                    return;
                }

                let role = indv_data["role"]

                if (args.includes("-desc")){
                    message.author.send("Your role is: " + role_list[role].name + "\n\n" + role_list[role].description)
                }
                else {
                    message.author.send("Your role is: " + role_list[role].name + "\n\nUse \"m!role -desc\" for a more detailed explanation.")
                }               
                return;

            case "target":
                message.author.send("You have targetted ### with your role")
                console.log(message.author.username + " has targetted ###")
                return;

            case "alive":
                response = "The players still alive are:"

                for (player in player_data){
                    if (player_data[player].status === 1){
                        response += "\n" + player_data[player].name
                    }
                }

                message.channel.send(response);
                return;

            case "town":
            case "players":
                response = "The full list of players in the game is:"

                for (player in player_data){            
                    response += "\n" + player_data[player].name
                }

                message.channel.send(response);
                return;

            case "new":
                //console.log(message.member.roles.cache);
                if (message.member.roles.cache.some(role => role.name === "Gamesmaster")) {
                    message.reply("NEW GAME TRIGGER");
                }
                else{
                    message.reply("You require a \"Gamesmaster\" role to start a new game!");
                }
                return;

            case "join":

                if (!player_data[message.author.id]){               
                    message.reply("What is your name?\n\nRespond with \"m!name <name>\"")

                    const nameFilter = msg => msg.content.startsWith("m!name");

                    try{
                        nameCollector.stop();
                    }catch(e) {}
                    nameCollector = message.channel.createMessageCollector(nameFilter, {time: 30000});

                    nameCollector.on("collect", msg =>{
                        let name_in = msg.content.slice(6).split(" ");
                        name_in = name_in.join(" ");
                        
                        message.reply("What would you like your emoji to be?\n\nReact to this message with the emoji of your choice!")                    
                    
                        const emojiFilter = msg => msg.content.startsWith("m!emoji");
                        const emojiCollector = message.channel.createMessageCollector(emojiFilter, {time: 120000});

                        emojiCollector.on("collect", msg =>{
                            let emoji_in = msg.content.slice(7).split(" ")[0];
                            for (player in player_data){
                                console.log(player["emoji"]);
                            }

                            data["player_data"][message.author.id] = {
                                name: name_in,
                                emoji: emoji_in,
                                game_data: {}
                            }

                            message.reply("Thank you for joining! You'll now be able to join a game of Mafia!");

                            let outData = JSON.stringify(data, null, 2);
                            fs.writeFileSync("mafia_Data.json", outData);
                        });
                    });
                }
                return;
        }
        
        if (!message.guild) return;

        switch(command) {            
            case ("lynch"):
            case ("vote"):
                const user = message.mentions.users.first();
            
                if (user) {
                    const member = message.guild.member(user);

                    if (member){
                        message.reply("You have voted to lynch " +  member.nickname);
                    }                
                }
                else {
                    message.reply("You haven't specified a user")
                }
                return;

            case ("lynchpoll"):
                let poll = "Vote for who you want to lynch by responding with the appropriate emoji:\n\n";
                for (id in data.player_data) {
                    pdata = data.player_data[id]
                    if (pdata["status"] === 1){
                        poll += "   " + pdata["name"] + ":  " + pdata["emoji"] + "\n"
                    }
                }
                message.channel.send(poll).then( messageReaction => {
                    for (id in data.player_data) {
                        pdata = data.player_data[id]
                        if (pdata["status"] === 1){
                            messageReaction.react(pdata["emoji"])
                        }
                    }
                });
        }
    }
});

client.login(TOKEN);