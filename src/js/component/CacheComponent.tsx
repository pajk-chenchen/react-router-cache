import React, { useRef, useState, useEffect } from 'react'
import Cache from '../react-router/Cache'
// import './index.css';

type Props = {
  component: React.FunctionComponent;
  options: any;
  show: boolean;
}

type RefProps = {
  current: HTMLDivElement | null
}

const MAX_SCROLL = 20

function CacheComponent(props: Props) {
  const cacheCmp: RefProps = useRef(null)
  const start = useRef({x: 0, y: 0})
  const [style, setStyle] = useState({})


  useEffect(() => {
    if (!props.show) {
      return removeListener
    }
    const element = cacheCmp.current

    console.log(queryCssInStyleLabel('.cache'));
    if (!queryCssInStyleLabel('.cache')) {
      createStyle(`
        .cache {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background-color: #FFFFFF;
        }
        .show {
          transform: translate(100%, 0);
          -webkit-transform: translate(100%, 0);
          transition: transform .5s ease-in-out;
          -webkit-transition: transform .5s ease-in-out;
        }
      `)
    }

    if (element) {
      element.addEventListener('touchstart', touchstart)
      element.addEventListener('touchmove', touchmove)
      element.addEventListener('touchend', touchend)
      element.addEventListener('touchcancel', touchend)
    }
    return removeListener
  }, [ props.show ])

  function removeListener() {
    const element = cacheCmp.current
    if (element) {
      element.removeEventListener('touchstart', touchstart)
      element.removeEventListener('touchmove', touchmove)
      element.removeEventListener('touchend', touchend)
      element.removeEventListener('touchcancel', touchend)
    }
  }

  useEffect(() => {
    if (props.show) {
      setTimeout(() => {
        setStyle({
          transform: `translate(0, 0)`
        })
      }, 20)
    }
  }, [ props.show ])

  function queryCssInStyleLabel(classname: string) {
    const styles = Array.from(document.styleSheets)
    return Boolean(styles.filter(item => {
      const cssRules = Array.from(item.cssRules)
      return Boolean(cssRules.filter(itm => {
        if (itm instanceof CSSStyleRule) {
          return itm.selectorText.indexOf(classname) !== -1
        }
        return false
      }).length)
    }).length)
  }

  function createStyle(css: string) {
    const style = document.createElement('style')
    style.innerHTML = css
    document.head.appendChild(style)
  }

  function touchstart(e: TouchEvent) {
    const { pageX, pageY } = e.touches[0]
    start.current = { x: pageX, y: pageY }
  }

  function touchmove(e: TouchEvent) {
    const { pageX, pageY } = e.touches[0]
    const { x, y } = start.current

    if (Math.abs(pageX - x) > Math.abs(pageY - y)) {
      if (pageX - x > 0) {
        setStyle({
          transform: `translate(${pageX - x}px, 0)`,
          transition: 'none'
        })
      }
    }
  }

  function touchend(e: TouchEvent) {
    const { pageX } = e.changedTouches[0]
    const { x } = start.current
    const element = cacheCmp.current
    const width = element?.offsetWidth || 0
    if (pageX - x > MAX_SCROLL * width / 100) {
      // 关闭当前页面
      if (deleteCacheWhenBack()) {
        setStyle({
          transform: `translate(100%, 0)`,
          transition: 'transform .5s ease-in-out'
        })
      } else {
        setStyle({
          transform: `translate(0, 0)`,
          transition: 'transform .5s ease-in-out'
        })
      }
    } else {
      setStyle({
        transform: `translate(0, 0)`,
        transition: 'transform .5s ease-in-out'
      })
    }
  }

  function deleteCacheWhenBack() {
    const { options } = props
    const { history, location } = options
    const caches = Cache.getCache()
    if (caches.length <= 1) return false
    Cache.reduce(location)

    setTimeout(() => {
      history.back()
    }, 500)
    return true
  }

  return <div
    className={`cache ${props.show ? 'show' : 'hide'}`}
    ref={cacheCmp}
    style={props.show ? style : {}}
  >
    { React.createElement(props.component, props.options) }
  </div>
}

export default CacheComponent
