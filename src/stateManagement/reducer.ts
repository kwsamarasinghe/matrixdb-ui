// reducers.ts
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import {State} from "./store";

type Action = ActionType<typeof actions>;


const initialState: State = {
    currentState: 'init',
    filterConfiguration: {
        interactor: [],
        interaction: []
    },
    filters: [],
    network: {}
};

const NetworkViewReducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case actions.SELECT_TYPE:
            return {
                currentState: 'type_selected',
                filterConfiguration: {},
                filters: [],
                network: {}
            };
        case actions.DELETE:
            return {
                currentState: 'init',
                filterConfiguration: {},
                filters: [],
                network: {}
            };
        case actions.ADD_FILTER_CRITERION:
            return {
                ...state,
                filterConfiguration: action.payload
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
