module.exports = (req) => {
  const islenoxbot = [];
  if (req.user) {
    for (let i = 0; i < req.user.guilds.length; i += 1) {
      if (((req.user.guilds[i].permissions) && 8) === 8 && req.user.guilds[i].lenoxbot === true) {
        islenoxbot.push(req.user.guilds[i]);
      }
    }
  }
  return islenoxbot;
};
