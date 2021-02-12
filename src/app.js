import './styles.css'
import { Chess } from './components/chess'
import { I18nProvider } from './i18n'
import { Footer, Header, Section } from './components/layout'
import { string } from 'prop-types'

const App = ({ FEN }) => {
  return (
    <I18nProvider language="en-GB">
      <Header />
      <Section>
        <Chess FEN={FEN.replace(/_/g, ' ')} />
      </Section>
      <Footer />
    </I18nProvider>
  )
}

export default App

App.propTypes = {
  FEN: string,
}

App.defaultProps = {
  FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR_w_KQkq_-_0_1',
}
