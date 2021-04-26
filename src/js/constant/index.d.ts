import React from 'react';
export interface LocationProps {
    pathname?: string;
    index?: number;
    search?: string;
    hash?: string;
    key?: string;
}
export interface HistoryProps {
    location?: LocationProps;
    listen: Function;
    push: Function;
    replace?: Function;
    go?: Function;
    back?: Function;
    foward?: Function;
}
export interface MatchProps {
    isExact: boolean;
    params: any;
    path: string;
    url: string;
}
export interface Props {
    children: React.ReactElement<any>;
    history: HistoryProps;
    location?: LocationProps;
    match?: MatchProps;
}
