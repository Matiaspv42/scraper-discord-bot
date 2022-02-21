const dotenv = require('dotenv')
const discord = require('discord.js');
dotenv.config()
const client = new discord.Client({
    intents:[
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_MESSAGES
    ]
})

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin());

const embeddedMessage = (content, url) =>{
    let messageEmbedded = new discord.MessageEmbed()
    .setURL(url)
    .setDescription(content)

    return messageEmbedded
}

client.on('ready', ()=>{
    console.log('the bot is online')
})

client.on("messageCreate", (msg) => {
    if(msg.content.startsWith('!floor')){
        const after = msg.content.substring(msg.content.indexOf(' ') + 1).toLowerCase();
        (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = `https://magiceden.io/marketplace/${after}`
        await page.goto(url);
        await page.waitForTimeout(5000)
        // await page.waitForSelector('[class= "row attributes attributes-row"]')
        let texts = await page.evaluate(() => {
            let data = [];
            let elements = document.getElementsByClassName('row');
            for (var element of elements){
                data.push(element.textContent)}
            return data
        })
        await browser.close();
        console.log(embeddedMessage(texts[0], url))
        return [texts,url]
        })().then( (data) => msg.channel.send({embeds: [embeddedMessage(data[0][0], data[1])]}));   
    }
  
})

client.login(process.env.TOKEN) 