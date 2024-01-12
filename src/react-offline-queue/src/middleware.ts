/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { enqueue } from './slice';
import { getOnline } from './selectors';
import { Configuration } from './types';

const createOfflineMiddleware = (configuration: Configuration): any => {
  return (store: any) => (next: any) => (action: any) => {
    const { getState } = store;

    const deviceOnline: boolean = getOnline(getState());
    const { persistedActions } = configuration;
  
    if (
      !deviceOnline &&
      action &&
      action.type && 
      persistedActions.includes(action.type)
    ) {
      return next(enqueue(action));
    }
  
    return next(action);
  };
}

export default createOfflineMiddleware;
