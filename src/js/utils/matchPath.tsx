import { pathToRegexp } from "path-to-regexp";

const cache: any = {};
const cacheLimit = 10000;
let cacheCount = 0;

type OptionsProps = {
  path?: Array<never> | undefined;
  exact?: boolean;
  end?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}

function compilePath(path: string, options: OptionsProps) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys: Array<any> = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname: string, options: OptionsProps & string & Array<never>) {
  let cpOptions: OptionsProps = options
  if (typeof options === "string" || Array.isArray(options)) {
    cpOptions = { path: options, exact: false, strict: false, sensitive: false };
  }

  const { path, exact = false, strict = false, sensitive = false } = cpOptions;

  const paths = [].concat(path || []);

  return paths.reduce((matched: any, path: string) => {
    if (!path && path !== "") return null;
    if (matched) return matched;

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo: any, key: any, index: number) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

export default matchPath;