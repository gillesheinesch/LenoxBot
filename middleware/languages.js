module.exports = (req) => {
  const languagesList = [{
    fileName: 'en-US',
    name: 'English',
    icon: 'us',
    status: false
  },
  {
    fileName: 'de-DE',
    name: 'German',
    icon: 'de',
    status: false
  },
  {
    fileName: 'fr-FR',
    name: 'French',
    icon: 'fr',
    status: false
  },
  {
    fileName: 'es-ES',
    name: 'Spanish',
    icon: 'es',
    status: false
  },
  {
    fileName: 'de-CH',
    name: 'Swiss',
    icon: 'ch',
    status: false
  },
  {
    fileName: 'tr-TR',
    name: 'Turkish',
    icon: 'ch',
    status: false
  }];

  const currentLanguage = req.getLocale();
  for (let i = 0; i < languagesList.length; i += 1) {
    if (languagesList[i].fileName === currentLanguage) {
      languagesList[i].status = true;
    }
  }
  return languagesList;
};
