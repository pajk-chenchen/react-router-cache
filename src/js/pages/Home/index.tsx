import { useState, useEffect } from 'react'
import logo from './logo.svg';
import { Props } from '../../constant'
import './App.css';

function App(props: Props) {
  const [render, setRender] = useState(0)

  useEffect(() => {
    setRender(1)
  }, [])

  function redirectUrl() {
    const { history } = props
    history.push('/test')
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span
          className="App-link"
          onClick={redirectUrl}
        >
          To Test
        </span>
        <span>{render}</span>
      </header>
    </div>
  );
}

export default App
