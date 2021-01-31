import { node, string } from 'prop-types'
import { useMemo } from 'react'
import I18Context from './i18n-context'
import enGB from './translations/en-GB.json'

const languages = {
  'en-GB': enGB,
}

export const I18nProvider = ({ language, children }) => {
  const content = useMemo(() => languages[language], [language])
  return <I18Context.Provider value={{ content }}>{children}</I18Context.Provider>
}

I18nProvider.propTypes = {
  language: string.isRequired,
  children: node.isRequired,
}
