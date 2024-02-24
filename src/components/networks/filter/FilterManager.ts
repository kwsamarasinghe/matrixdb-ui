import {FilterCriterionConfiguration} from "./FilterConfigurationManager";

export interface FilterCriterion {
    id: string,
    value?: any
}

export interface Filter {
    interactors : FilterCriterion[],
    interactions: FilterCriterion[]
}


class FilterManager {

    private readonly networkData: any;

    constructor(networkData: any) {
        this.networkData = networkData;
    }

    private filterInteractors(filterCriterion : any, networkData: any) {
        let filteredInteractions = networkData.interactors.filter((interactor : any) => {
            return interactor[filterCriterion.key] === filterCriterion.value;
        });
        networkData.interactors = filteredInteractions;
    }

    private filterInteractions(filterCriterion: any, networkData: any) {
        let filteredInteractions = networkData.interactions.filter((interaction : any) => {
            return interaction[filterCriterion.key] === filterCriterion.value;
        });
        networkData.interactions = filteredInteractions;
    }

    getFilteredNetwork(filters: Filter) {
        if(filters.interactions.length === 0 && filters.interactors.length === 0) {
            return this.networkData;
        }

        let filteredNetwork = {
            biomolecules: JSON.parse(JSON.stringify(this.networkData.biomolecules)),
            interactors: JSON.parse(JSON.stringify(this.networkData.interactors)),
            interactions: JSON.parse(JSON.stringify(this.networkData.interactions))
        };

        // Apply filter to interactors and interactions
        let filteredInteractors = filteredNetwork.interactors;
        filters.interactors.forEach((filter: FilterCriterion) => {
            filteredInteractors = filteredInteractors.filter((interactor: any) => {
                    if(interactor.id === filteredNetwork.biomolecules[0]) {
                        return true;
                    }
                    return interactor[filter.id] === filter.value;
            })
        });

        let filteredInteractions = filteredNetwork.interactions;
        filters.interactions.forEach((filter: FilterCriterion) => {
            filteredInteractions = filteredInteractors.filter((interaction: any) => interaction[filter.id] === filter.value);
        });

        // Remove interactions associated in filtered biomolecules
        filteredInteractions = filteredInteractions.filter((interaction: any) => {
            let p1 = interaction.participants[0];
            let p2 = interaction.participants[1];

            if((filteredInteractors.map((interactor: any) => interactor.id).includes(p1) && p2 === filteredNetwork.biomolecules[0])
            ||
            (filteredInteractors.map((interactor: any) => interactor.id).includes(p2) && p1 === filteredNetwork.biomolecules[0])) {
                return true
            }
        });

        filteredNetwork.interactors = filteredInteractors;
        filteredNetwork.interactions = filteredInteractions;

        return filteredNetwork;
    }

}

export default FilterManager;