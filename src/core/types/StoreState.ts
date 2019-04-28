import { RouterState } from 'connected-react-router';
import { ApiState } from '../../generated/core/state/ApiState';

export interface StoreState {
    readonly api: ApiState;
    readonly router: RouterState;
}
