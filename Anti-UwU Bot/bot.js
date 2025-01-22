const Discord = require('discord.js');
const client = new Discord.Client();
const token = require(`./auth.json`).token; // fuck it, you can have the token too, knock yourself out
console.log(`Anti-UwU Bot version 2.0.0`);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

// triggers are a bit outdated but should be a start
var triggerList = ["owo", "ewe", "qwq", "0w0", "uwu", "uwo", "owu", ":3", "hewwo", "3:", "yiff", "vore", "rawr", "bad dragon", "e621", "tungsten(iv) oxide", "notices bulge", "pounces", "μwμ", "x3", "3x", "nuzzles", "fuwwy"]

console.log("Current list of triggers:")
console.log(triggerList.toString())

// so fun fact, did you know this was typed out in the default notepad? that's why the formatting is so jank, if you want to fix it be my guest
client.on('message', message => {
        
        if(message.author.id === client.user.id) return;
		    triggerList.forEach(function(entry) {
			    if(message.content.toLowerCase().includes(entry)){
			        message.channel.send('*internal screaming*')
			    	console.log(`message sent containing a trigger, internal scream fired`)
                }
        });

        if(message.content.toLowerCase().includes('anti!statuscheck')){
            message.channel.send('Anti-UwU Bot is working as intended.')
            console.log(`Anti-UwU Bot's status checked, sent response back`)
        }

        if(message.content.toLowerCase().includes('*internal screaming*')){
            message.channel.send('dont mock me')
            console.log(`reacted to an *internal screaming*`)
        }



});