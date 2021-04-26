import { LocationProps } from '../constant';
interface CacheListProps {
    cache: LocationProps;
    floor: number;
}
declare const Cache: {
    floor: number;
    add(cache: LocationProps): void;
    reduce(cache: LocationProps): boolean;
    getCache(): CacheListProps[];
    getCurrentCache(): CacheListProps;
};
export default Cache;
