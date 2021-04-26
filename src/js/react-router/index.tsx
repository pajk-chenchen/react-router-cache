import React, { useEffect, useState, useRef } from 'react'
import { LocationProps } from '../constant'
import HistoryContext from '../context/HistoryContext'
import RouterContext from '../context/RouterContext'
import Route from './Route'
import matchPath from '../utils/matchPath'
import Cache from '../react-router/Cache'

type Ref = {
  current: any
}

const Router: React.FunctionComponent<any> = props => {
  const _isMounted: Ref | null = useRef(false)
  const _pendingLocation: Ref | null = useRef(null)
  const unliten: Ref | null = useRef(null)

  const [location, setLocation]: [LocationProps, Function] = useState({})
  const [routes, setRoutes]: [HTMLElement | null, Function] = useState(null)

  useEffect(() => {
    setLocation(props.history.location)

    unliten.current = props.history.listen((res: any) => {
      if (_isMounted.current) {
        setLocation(res.location)
        checkLastPath(res.location)
        checkPathInChildren()
      } else {
        _pendingLocation.current = location
      }
    })

    _isMounted.current = true

    const caches = Cache.getCache()
    if (caches.length < 1) {
      Cache.add(props.history.location)
      checkPathInChildren()
    }

    return () => {
      if (unliten.current) {
        unliten.current()
        _isMounted.current = false
        _pendingLocation.current = null
      }
    }
  }, [])

  function checkPathInChildren() {
    const { children } = props
    const caches = Cache.getCache()
    
    const cloneRoutes = caches.map((item, index) => {
      for(let i = 0; i < children.length; i++) {
        const child = children[i]
        if (matchPath(item.cache.pathname || '', child.props.path)) {
          return React.cloneElement(child, { key: `${child.props.path}_${index}` })
        }
      }
    }).filter(item => item)

    setRoutes(cloneRoutes)
  }

  function checkLastPath(location: LocationProps) {
    const caches = Cache.getCache()
    if (caches.length < 1) return

    const lastCache = caches[caches.length - 1] || {}
    const { cache = {} } = lastCache
    if (location.key !== cache.key) {
      Cache.add(location)
    }
  }

  useEffect(() => {
    if (_pendingLocation.current) {
      setLocation({ ..._pendingLocation.current })
    }
  }, [ _pendingLocation.current ])

  return <RouterContext.Provider
    value={{
      history: props.history,
      location,
      match: computeRootMatch(location.pathname)
    }}
  >
    <HistoryContext.Provider
      children={routes}
      value={props.history}
    />
  </RouterContext.Provider>
}

function computeRootMatch(pathname: string | undefined) {
  return {
    path: '/',
    url: '/',
    params: {},
    isExact: pathname === '/'
  }
}

export { Router }
export { Route }