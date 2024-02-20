import { configureStore } from '@reduxjs/toolkit'
import NetworkViewReducer from "./reducer";
import {Filter} from "../components/networks/filter/FilterManager";
import {FilterConfiguration} from "../components/networks/filter/FilterConfigurationManager";

const store = configureStore({
    reducer: NetworkViewReducer
});

interface State {
    currentState: 'init' | 'type_selected';
    filterConfiguration: FilterConfiguration;
    filters: Filter[];
    network: any;
}

export type { State };
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };