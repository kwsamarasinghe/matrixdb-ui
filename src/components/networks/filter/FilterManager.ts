export interface FilterCriterion {
    id: string,
    value?: any
}

export interface Filter {
    type: string,
    criteria: FilterCriterion[]
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

    getFilteredNetwork(filters: Filter[]) {
        let filteredNetwork = this.networkData;
        filters.forEach((filter: any) => {
           // Apply filter to interactors and interactions
           Object.keys(filter).forEach((interactorCriteria: any) => {
               if(filter.type === 'INTERACTOR') {
                    this.filterInteractors(filter, filteredNetwork);
               }

               if(filter.type === 'INTERACTION') {
                    this.filterInteractions(filter, filteredNetwork);
               }
           });
        });
        return filteredNetwork;
    }

}

export default FilterManager;