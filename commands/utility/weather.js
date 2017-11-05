const got = require('got');
const Discord = require('discord.js');

const makeURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
const celsius = (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9);

const spacer = {
    name: '\u200b',
    value: '\u200b',
};

exports.run = async (client, msg, args) => {
    if (args.length < 1) {
        msg.channel.send('Please enter a city or town!').then(m => m.delete(10000));
    }

    const city = args.join(' ');
    const res = await got(makeURL(city), { json: true });

    if (!res || !res.body || !res.body.query || !res.body.query.results || !res.body.query.results.channel) {
        msg.channel.send('An error has occurred. Could not load the weather for this city or town!').then(m => m.delete(10000));
    }

    const weatherInfo = res.body.query.results.channel;
    const forecast = weatherInfo.item.forecast[0];

    const description = `The current temperature ${weatherInfo.location.city} is ${weatherInfo.item.condition.temp}°F/${celsius(weatherInfo.item.condition.temp)}°C`;
    const embed = new Discord.RichEmbed()
    .addField('🏖 Weather', weatherInfo.item.condition.text)
    .addField('💦Humidity', weatherInfo.atmosphere.humidity + '%')
    .addField(':wind_blowing_face: Wind', `*${weatherInfo.wind.speed}mph* ; Direction: *${weatherInfo.wind.direction}°*`)
    .addField(`🔔 Prediction for today is: *${forecast.text}*`, `The highest temperature is ${forecast.high}°F/${celsius(forecast.high)}°C, the lowest temperature ${forecast.low}°F/${celsius(forecast.low)}°C`)
    .addField(`:sunrise: Sunrise`, weatherInfo.astronomy.sunrise)
    .addField(`:city_sunset: Sunset`, weatherInfo.astronomy.sunset)
    .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
    .setFooter('LenoxBot Weather')
	.setColor('#0066CC');

    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'weather',
	description: 'weather of a town or a city',
    usage: 'weather {location}',
    example: 'weather Paris',
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
