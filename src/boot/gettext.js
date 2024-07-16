import { boot } from 'quasar/wrappers'
import { createGettext } from 'vue3-gettext'
import translations from '../i18n/translations.json'

const gettext = createGettext({
  availableLanguages: {
    en_US: 'American English',
    fr_FR: 'francais',
    es_ES: 'Español',
    eu_ES: 'Euskara',
    gl_ES: 'Galego',
  },
  translations,
  defaultLanguage: 'fr_FR',
  mutedLanguages: ['en_US'],
  setGlobalProperties: true,
})

export default boot(({ app, store }) => {
  app.config.globalProperties.$gettext = gettext
  app.use(gettext)
  store.$gettext = gettext
})

export { gettext }
