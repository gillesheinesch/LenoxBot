const got = require('got');
const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

const makeURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
const celsius = (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9);

module.exports = class weatherCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'weather',
      group: 'searches',
      memberName: 'weather',
      description: 'Weather of a town or a city',
      format: 'weather {location}',
      aliases: [],
      examples: ['weather Paris'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (args.length < 1) {
      msg.channel.send(lang.weather_noinput);
    }

    const city = args.join(' ');
    const res = await got(makeURL(city), { json: true });

    if (!res || !res.body || !res.body.query || !res.body.query.results || !res.body.query.results.channel) {
      msg.channel.send(lang.weather_error);
    }

    const weatherInfo = res.body.query.results.channel;
    const forecast = weatherInfo.item.forecast[0];

    const current = lang.weather_current.replace('%location', weatherInfo.location.city).replace('%temperature', `${weatherInfo.item.condition.temp}°F/${celsius(weatherInfo.item.condition.temp)}°C`);
    const temperature = lang.weather_temperature.replace('%highesttemperature', `${forecast.high}°F/${celsius(forecast.high)}°C`).replace('%lowesttemperature', `${forecast.low}°F/${celsius(forecast.low)}°C`);
    const queryby = lang.weather_queryby.replace('%authortag', msg.author.tag);
    const embed = new Discord.MessageEmbed()
      .addField(`🏖 ${lang.weather_weather}`, weatherInfo.item.condition.text)
      .addField(`💦 ${lang.weather_humidity}`, `${weatherInfo.atmosphere.humidity}%`)
      .addField(`:wind_blowing_face: ${lang.weather_wind}`, `*${weatherInfo.wind.speed}mph* ; ${lang.weather_direction}: *${weatherInfo.wind.direction}°*`)
      .addField(`🔔 ${lang.weather_prediction} *${forecast.text}*`, temperature)
      .addField(`:sunrise: ${lang.weather_sunrise}`, weatherInfo.astronomy.sunrise)
      .addField(`:city_sunset: ${lang.weather_sunset}`, weatherInfo.astronomy.sunset)
      .setAuthor(weatherInfo.location.city)
      .setFooter(queryby)
      .setDescription(current)
      .setColor('#0066CC');

    msg.channel.send({ embed });
  }
};
