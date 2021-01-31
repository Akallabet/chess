/* eslint-disable react/display-name */
import I18nContext from './i18n-context'

export const withI18n = (Component) => (props) => {
  return (
    <I18nContext.Consumer>
      {({ content }) => <Component {...props} content={content} />}
    </I18nContext.Consumer>
  )
}
