import './styles.css'
import { Chess } from './components/chess'
import { I18nProvider } from './i18n'
import { Footer, Header, Section } from './components/layout'

const App = () => {
  return (
    <I18nProvider language="en-GB">
      <Header />
      <Section>
        <Chess />
      </Section>
      <Footer />
    </I18nProvider>
  )
}

export default App
