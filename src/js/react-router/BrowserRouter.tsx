import { Router } from './index'
import { createHashHistory as createHistory } from 'history'

const BrowserRouter: React.FunctionComponent = (props) => {
  const history = createHistory()
  return <Router history={history} children={props.children} />
}

export default BrowserRouter