import RouterContext from '../context/RouterContext'
import matchPath from '../utils/matchPath'
import CacheComponent from '../component/CacheComponent'

const Route = (props: any) => <RouterContext.Consumer>
  {
    (context: any) => {
      const location = context.location || {}
      const match = matchPath(location.pathname, props)
      const that = { ...context, location, match }

      const { component } = props

      return <RouterContext.Provider value={that}>
        <CacheComponent
          component={component}
          options={that}
          show={that.match}
        />
      </RouterContext.Provider>
    }
  }
</RouterContext.Consumer>

export default Route