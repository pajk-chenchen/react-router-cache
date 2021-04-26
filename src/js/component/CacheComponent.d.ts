import React from 'react';
import './index.css';
declare type Props = {
    component: React.FunctionComponent;
    options: any;
    show: boolean;
};
declare function CacheComponent(props: Props): JSX.Element;
export default CacheComponent;
