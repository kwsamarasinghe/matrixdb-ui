// actions.ts
import { createAction } from 'typesafe-actions';
import {State} from "./store";

export const SELECT_TYPE = 'SELECT_TYPE' as const;
export const DELETE = 'DELETE' as const;
export const CLEAR_FILTER = 'CLEAR_FILTER' as const;
export const SET_NETWORK_DATA = 'SET_NETWORK_DATA' as const;

export const ADD_FILTER_CRITERION = 'ADD_FILTER_CRITERION' as const;
export const UPDATE_FILTER = 'UPDATE_FILTER' as const;

export const selectTypeAction = createAction(SELECT_TYPE)();
export const deleteAction = createAction(DELETE)();
export const clearFilterAction = createAction(CLEAR_FILTER)();
export const setNetworkDataAction = createAction(SET_NETWORK_DATA)<{
    payload: Partial<State['network']>;
}>();

export const updateFilter = createAction(UPDATE_FILTER)<State['filters']>();

