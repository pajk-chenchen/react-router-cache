declare type OptionsProps = {
    path?: Array<never> | undefined;
    exact?: boolean;
    end?: boolean;
    strict?: boolean;
    sensitive?: boolean;
};
/**
 * Public API for matching a URL pathname to a path.
 */
declare function matchPath(pathname: string, options: OptionsProps & string & Array<never>): any;
export default matchPath;
