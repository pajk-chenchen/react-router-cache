import { LocationProps } from '../constant'

interface CacheListProps {
  cache: LocationProps,
  floor: number
}

const cachelist: Array<CacheListProps> = []

const Cache = {
  floor: 0,
  add(cache: LocationProps) {
    cachelist.push({
      cache,
      floor: this.floor
    })
  },
  reduce(cache: LocationProps) {
    for (let i = cachelist.length - 1; i >= 0; i++) {
      const cur = cachelist[i]
      if (cur.cache.key === cache.key) {
        cachelist.splice(i, 1)
        return true
      }
    }

    return false
  },
  getCache() {
    return cachelist
  },
  getCurrentCache() {
    return cachelist[cachelist.length - 1]
  }
}

export default Cache