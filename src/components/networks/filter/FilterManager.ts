
export interface FilterCriterion {
    id: string,
    value?: any,
    subCriteria?: FilterCriterion
}

export interface Filter {
    interactors : FilterCriterion[],
    interactions: FilterCriterion[]
}


class FilterManager {

    private readonly filterConfiguration : any;
    private readonly networkData: any;
    private readonly networkContext: any;
    private readonly reverseNetworkContext: any;

    constructor(networkData: any, filterConfiguration: any) {
        this.networkData = networkData;
        this.networkContext = networkData.context;
        this.reverseNetworkContext = this.reverseContext(this.networkContext);
        this.filterConfiguration = filterConfiguration;
    }

    private reverseContext(context: any): any {
        let interactorContext = context.interactors;
        let interactionContext = context.interactions;

        let reversContext : any = {
            interactors: {},
            interactions: {}
        };

        // Interactor context
        Object.keys(interactorContext).map((contextType: string) => {
            let contextTypeMap = interactorContext[contextType];
            reversContext.interactors[contextType] = {};
            Object.keys(contextTypeMap).forEach((key: any) => {
                reversContext.interactors[contextType][key] = {};
                Object.keys(contextTypeMap[key]).forEach((subkey: any) => {
                    reversContext.interactors[contextType][key][contextTypeMap[key][subkey]] = Number(subkey);
                })
            });
        });

        Object.keys(interactionContext).map((contextType: string) => {
           let contextTypeMap = interactionContext[contextType];
            reversContext.interactions[contextType] = {};
           Object.keys(contextTypeMap).forEach((key: any) => {
               reversContext.interactions[contextType][contextTypeMap[key]] = Number(key);
           });
        });

        return reversContext;
    }

    public getFilteredNetwork(filters: Filter) {
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
            // Get the reverse context mapping
            filteredInteractors = filteredInteractors.filter((interactor: any) => {
                    if(interactor.id === filteredNetwork.biomolecules[0]) {
                        return true;
                    }

                    if(filter.subCriteria) {
                        if(!interactor[filter.id]) return false;
                        if(interactor[filter.id] && interactor[filter.id].length === 0) return false;

                        let filterValue: string;
                        if(this.reverseNetworkContext.interactors[filter.id][filter.subCriteria.id]) {
                            filterValue = this.reverseNetworkContext.interactors[filter.id][filter.subCriteria.id][filter.subCriteria.value];
                        } else {
                            filterValue = filter.subCriteria.value;
                        }

                        let criteriaValue = interactor[filter.id].find((criterionValue: any) => {
                            if(filter.subCriteria) {
                                if(typeof filter.subCriteria.value === 'number') {
                                    if(criterionValue[filter.subCriteria.id] >= filterValue) {
                                        return true;
                                    }
                                } else {
                                    return criterionValue[filter.subCriteria.id] === filterValue;
                                }
                            }
                            return false;
                        });
                        return !!criteriaValue;
                    }

                    if(typeof filter.value === 'number') {
                        if(interactor[filter.id] >= filter.value) {
                            return true;
                        }
                    } else {
                        return (filter.value && interactor[filter.id] === filter.value);
                    }
                    return false;
            });
        });

        let filteredInteractions = filteredNetwork.interactions;
        filters.interactions.forEach((filter: FilterCriterion) => {
            // Get the reverse context mapping
            let filterValue: string;
            if(this.reverseNetworkContext.interactions[filter.id]) {
                filterValue = this.reverseNetworkContext.interactions[filter.id][filter.value];
            } else {
                filterValue = filter.value;
            }

            filteredInteractions = filteredInteractions.filter((interaction: any) => {
                if(typeof filter.value === 'number') {
                    if(interaction[filter.id] >= filterValue) {
                        return true;
                    }
                } else {
                    if(Array.isArray(interaction[filter.id])) {
                        return interaction[filter.id].includes(filterValue);
                    } else {
                        return interaction[filter.id] === filterValue;
                    }
                }
                return false;
            });
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
            return false;
        });

        filteredNetwork.interactors = filteredInteractors;
        filteredNetwork.interactions = filteredInteractions;
        return filteredNetwork;
    }

    public getContext(criteriaType: string, criteria: string, subCriteria: string | undefined, value: string) {
        if(subCriteria) {
            if(this.networkContext[criteriaType][criteria][subCriteria]) {
                console.log(criteria + " " +subCriteria)
                return this.networkContext[criteriaType][criteria][subCriteria][value];
            } else {
                return value;
            }
        }
        if(this.networkContext[criteriaType][criteria]) {
            return this.networkContext[criteriaType][criteria][value];
        } else {
            return value;
        }
    }

    public getNetwork(){
        return this.networkData;
    }

}

export default FilterManager;