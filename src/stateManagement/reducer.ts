// reducers.ts
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import {State} from "./store";

type Action = ActionType<typeof actions>;


const initialState: State = {
    currentState: 'init',
    filterConfiguration: {
        interactors: [],
        interactions: []
    },
    filters: {
        interactors: [],
        interactions: []
    },
    network: {}
};

const NetworkViewReducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case actions.UPDATE_FILTER:
            return {
                ...state,
                filters: action.payload
            }
        case actions.SET_NETWORK_DATA:
            return {
                ...state,
                network: action.payload
            }
        default:
            return state;
    }
};

export default NetworkViewReducer;
