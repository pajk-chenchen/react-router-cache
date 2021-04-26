import ReactDOM from 'react-dom';
import './index.css';
import App from './js/pages/Home';
import Test from './js/pages/Test'
import reportWebVitals from './reportWebVitals';
// import { Route } from './js/react-router'
// import Router from './js/react-router/BrowserRouter'
import {BrowserRouter as Router, Route} from '../static/esm'

ReactDOM.render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <Router>
    <Route path="/app" component={App} />
    <Route path="/test" component={Test} />
  </Router>,
  document.getElementById('root')
);

reportWebVitals();
