import FilterManager, {Filter, FilterCriterion} from "./FilterManager";

export interface FilterCriterionConfiguration {
    id: string,
    label: string,
    options?: any,
    value?: any,
    subCriteria?: FilterCriterionConfiguration[],
    enable: boolean
}

export interface FilterConfiguration {
    [key: string]: FilterCriterionConfiguration[] | undefined
}

export class FilterConfigurationManager{

    private readonly networkData: any;
    private filterManager : FilterManager;
    private filterConfiguration: FilterConfiguration;
    constructor(networkData: any) {
        this.networkData = networkData;
        this.filterManager = new FilterManager(this.networkData);
        this.filterConfiguration = {
            interactor: [
                {
                    id: 'type',
                    label: 'Type',
                    options: [],
                    enable: false
                },
                {
                    id: 'ecm',
                    label: 'ECM Protein',
                    options: [true, false],
                    enable: false
                },
                {
                    id: 'geneExpression',
                    label: 'Transcriptomic Expression',
                    subCriteria: [
                        {
                            id: 'tissue',
                            label: 'Tissue',
                            options: [],
                            enable: false
                        },
                        {   id: 'tpm',
                            label: 'Expression Value (TPM)',
                            options: [],
                            enable: false
                        }
                    ],
                    enable: false
                }
            ],
            interaction: [
                {
                    id: 'score',
                    label: 'Confidence Score',
                    options: [],
                    enable: false
                },
                {
                    id: 'detectionMethod',
                    label: 'Detection Method',
                    options: [],
                    enable: false
                }
            ]
        }
    }

    private getInteractorOptions (existingFilterConfiguration: FilterCriterionConfiguration,
                                  filter: Filter,
                                  currentFilters: Filter[]) {

        // Get the filtered network for current filters
        const filteredNetwork = this.filterManager.getFilteredNetwork(currentFilters);

        let options : any[] = [];
        if(filter.type === 'interactor') {
            options = Array.from(new Set(filteredNetwork['interactors'].map((item: any) => {
                if (typeof item[existingFilterConfiguration.id] === 'boolean') {
                    return item ? 'Yes' : 'No';
                } else {
                    return item[existingFilterConfiguration.id];
                }
            }))).filter((value) => Boolean(value));
        }

        return options;
    }

    public getFilterConguration (filters: Filter[]) {
        if(filters.length === 0) {
            return {
                interactor: [],
                interaction: []
            }
        }

        // Get the filtered network for current filters
        const filteredNetwork = this.filterManager.getFilteredNetwork(filters);

        // Build the filter configuration based on filtered network
        let currentFilterConfiguration: FilterConfiguration = {};
        filters.forEach((filter: Filter) => {
            currentFilterConfiguration[filter.type] = [];
            if(filter.criteria && filter.criteria.length > 0 ) {
                // Update the configurations for existing filters
                let existingFilterCriterionIds: string[] = [];
                filter.criteria.forEach((existingCriterion: FilterCriterion) => {
                    // Get the config for existing filter criteria
                    existingFilterCriterionIds.push(existingCriterion.id);
                    let configForExisting = this.filterConfiguration[filter.type]?.find(
                        (filterCriterion: FilterCriterionConfiguration) =>
                            filterCriterion.id === existingCriterion.id
                    );
                    if(configForExisting) {
                        let newFilterCriterionConfig : FilterCriterionConfiguration = {
                            id: configForExisting.id,
                            label: configForExisting.label,
                            enable: true
                        };

                        if(configForExisting?.subCriteria) {
                            newFilterCriterionConfig.subCriteria = []
                            configForExisting?.subCriteria.forEach((subCriterion: FilterCriterionConfiguration) => {
                                let newFilterSubCriterionConfig : FilterCriterionConfiguration = {
                                    id: subCriterion.id,
                                    label: subCriterion.label,
                                    enable: true
                                };

                                // If value set it
                                if(existingCriterion?.value) {
                                    newFilterSubCriterionConfig = {
                                        ...newFilterSubCriterionConfig,
                                        value: existingCriterion.value
                                    };
                                } else {
                                    // else set options
                                    let options = this.getInteractorOptions(subCriterion, filter, filters);
                                    newFilterSubCriterionConfig = {
                                        ...newFilterSubCriterionConfig,
                                        options: options
                                    };
                                }
                                newFilterCriterionConfig.subCriteria?.push(newFilterSubCriterionConfig);
                            });
                        }

                        // If value set it
                        if(existingCriterion?.value) {
                            newFilterCriterionConfig = {
                                ...newFilterCriterionConfig,
                                value: existingCriterion.value
                            };
                        } else {
                            // else set options
                            let options = this.getInteractorOptions(configForExisting, filter, filters);
                            newFilterCriterionConfig = {
                                ...newFilterCriterionConfig,
                                options: options
                            };
                        }
                        currentFilterConfiguration[filter.type]?.push(newFilterCriterionConfig);

                    }
                });

                // Add non-existing filter criteria
                this.filterConfiguration[filter.type]?.forEach((filterCriterion: FilterCriterionConfiguration) => {
                    if(!existingFilterCriterionIds.includes(filterCriterion.id)) {
                        currentFilterConfiguration[filter.type]?.push( {
                            id: filterCriterion.id,
                            label: filterCriterion.label,
                            enable: true
                        });
                    }
                });

            } else {
                this.filterConfiguration[filter.type]?.forEach((filterCriterion: FilterCriterionConfiguration) => {
                    currentFilterConfiguration[filter.type]?.push( {
                        id: filterCriterion.id,
                        label: filterCriterion.label,
                        enable: true
                    });
                });
            }
        });

        return currentFilterConfiguration;
    }
}
