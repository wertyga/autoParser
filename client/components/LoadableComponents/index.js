import Loadable from 'react-loadable';

import LoadingComponent from '../Loading/Loading';

export const userOrder = Loadable({
    loader: () => import('../userOrder/userOrder'),
    loading() {
        return <LoadingComponent />
    }
});