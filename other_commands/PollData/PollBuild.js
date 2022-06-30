const { MessageEmbed, Interaction } = require('discord.js');

class SubPoll {
    constructor(Question, Answer){
        this.Question = Question.toString();
        this.Answers = Answer.toString().split("|");
        this.len = this.Answers.length
        this.Fields = []

        console.log(this.Answers);
        console.log(this.Question)

        const obj = {
            name : "default",
            value : "default",
            inline : false
        }

        this.Answers.forEach( (element, index) => {
            const obj = {
                name : "default",
                value : "default",
                inline : true
            }
            obj.name = `${String.fromCharCode(index+65)})`
            obj.value = element;
            this.Fields.push(obj);
        });

        console.log(this.Fields)

        this.embed = new MessageEmbed()
            .setTitle(this.Question)
            .setColor('#0099ff')
            .setFields(this.Fields)

        
        console.log("succesfully added question")

    }
}


class Poll {//uptime, amount of questions, answers per question, pinned?, ceator id, titel
    
    constructor(Titel, Description) {
        this.Titel = Titel;
        this.Description = Description
        this.Questions = [];
        this.mainPoll = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(Titel.toString())
            .setDescription(Description.toString())
            .setTimestamp()
    }

    addQuestion(Question, Answer){
        const newQuestion = new SubPoll(Question,Answer);
        this.Questions.push(newQuestion);
        console.log("added")
    }
    getEmbeds(){
        this.out = [this.mainPoll]
        this.Questions.forEach(element => {
            this.out.push([element.embed,element.len])
        })
        return this.out
    }
}
emojiLookup = ["🇦", "🇧","🇨"]
async function PrintEmbeds(interaction, data, eph){
    const [main, ...rest] = data;
        await interaction.reply({ embeds: [main], ephemeral: eph})
        for (const element of rest){
            const message = await interaction.followUp({embeds: [element[0]], ephemeral: eph, fetchReply: true})
            console.log(message)
            if (eph) continue;
            for (i = 0; i < element[1]; i++){
                message.react(emojiLookup[i])
            }
        }
}
module.exports = {PrintEmbeds, Poll}
