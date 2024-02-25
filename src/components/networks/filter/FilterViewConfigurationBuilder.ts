import FilterManager, {Filter, FilterCriterion} from "./FilterManager";
import {FilterConfiguration, FilterCriterionConfiguration} from "./FilterConfigurationManager";


class FilterCriterionViewConfigurationBuilder {

    private filterType: string;
    private filterManager : FilterManager;
    private currentFilters : Filter;

    private filterCriterionConfiguration: FilterCriterionConfiguration | undefined;
    private value: any | undefined;

    constructor(filterType: string,
                filterManager: FilterManager,
                currentFilters: Filter) {
        this.filterType = filterType;
        this.filterManager = filterManager;
        this.currentFilters = currentFilters;
    }

    public withConfig(filterCriterionConfiguration: FilterCriterionConfiguration) {
        this.filterCriterionConfiguration = filterCriterionConfiguration;
        return this;
    }

    public withValue(value: any) {
        this.value = value;
        return this;
    }

    public build() {
        if(!this.filterCriterionConfiguration) {
            return undefined;
        }

        // Updates the filter criterion options
        if(this.filterCriterionConfiguration && this.filterType) {
            // Get the filtered network for current filters
            const filteredNetwork = this.filterManager.getFilteredNetwork(this.currentFilters);

            if(this.filterCriterionConfiguration.options) {

                let optionsSet = new Set(filteredNetwork[this.filterType].map((item: any) => {
                    if(this.filterCriterionConfiguration?.id) {
                        if (typeof item[this.filterCriterionConfiguration.id] === 'boolean') {
                            return item ? 'Yes' : 'No';
                        } else {
                            return item[this.filterCriterionConfiguration.id]
                        }
                    }
                }).filter((value: any) => Boolean(value)));

                if(optionsSet.size > 0) {
                    this.filterCriterionConfiguration.options.range = Array.from(optionsSet);
                } else {
                    return undefined;
                }
            }

            if(this.filterCriterionConfiguration.subCriteria) {
                for(const subfilterCriterion of this.filterCriterionConfiguration.subCriteria){
                    if(subfilterCriterion.options) {
                        let optionSet = new Set();

                        filteredNetwork[this.filterType].forEach((item: any) => {
                            let filterCriterionId = this.filterCriterionConfiguration?.id;
                            if(filterCriterionId && item[filterCriterionId]) {
                                if (typeof item[filterCriterionId][subfilterCriterion.id] === 'boolean') {
                                    optionSet.add(item ? 'Yes' : 'No');
                                } else {
                                    if (Array.isArray(item[filterCriterionId])){
                                        item[filterCriterionId].forEach((subItem: any) => optionSet.add(subItem[subfilterCriterion.id]));
                                    } else {
                                        optionSet.add(item[filterCriterionId][subfilterCriterion.id]);

                                    }
                                }
                            }
                        });
                        if(optionSet.size > 0) {
                            subfilterCriterion.options.range = Array.from(optionSet);
                        } else {
                            return undefined;
                        }
                    }
                }
            }
        }

        // Sets the value if the filter is already selected
        if(this.value) {
            this.filterCriterionConfiguration.value = this.value;
        }
        return this.filterCriterionConfiguration;
    }
}

export class FilterViewConfigurationBuilder {

    private filterManager: FilterManager;
    private filterConfiguration : FilterConfiguration;
    private filters : Filter = {
        interactors: [],
        interactions: []
    };
    constructor(filterConfiguration: FilterConfiguration, filterManager : FilterManager) {
        this.filterManager = filterManager;
        this.filterConfiguration = filterConfiguration;
    }

    public with(filters: Filter) {
        this.filters = filters;
        return this;
    }

    public build() : FilterConfiguration {

        // Fill up interactor options
        let filterCriterionViewConfiBuilder = new FilterCriterionViewConfigurationBuilder(
            'interactors',
            this.filterManager,
            this.filters
        );
        this.filterConfiguration.interactor?.forEach((filterCriterionConfiguration: FilterCriterionConfiguration) => {
            if(!filterCriterionConfiguration.condition ||
                (filterCriterionConfiguration.condition && filterCriterionConfiguration.condition(this.filters))) {

                let existingFilter = this.filters.interactors.find(
                    (filterCriterion: FilterCriterion) => filterCriterion.id === filterCriterionConfiguration.id);

                let existingCriterionValue;
                if(existingFilter) {
                    existingCriterionValue = existingFilter.value;
                }

                let updatedFilterCriterionConfiguration = filterCriterionViewConfiBuilder
                    .withConfig(filterCriterionConfiguration)
                    .withValue(existingCriterionValue)
                    .build();
                if(updatedFilterCriterionConfiguration) {
                    updatedFilterCriterionConfiguration.enable = true;
                    filterCriterionConfiguration = updatedFilterCriterionConfiguration;
                }
            }
        });

        // Fill up interaction options
        filterCriterionViewConfiBuilder = new FilterCriterionViewConfigurationBuilder(
            'interactions',
            this.filterManager,
            this.filters
        );
        this.filterConfiguration.interaction?.forEach((filterCriterionConfiguration: FilterCriterionConfiguration) => {
            let existingFilter = this.filters.interactors.find(
                (filterCriterion: FilterCriterion) => filterCriterion.id === filterCriterionConfiguration.id);

            let existingCriterionValue;
            if(existingFilter) {
                existingCriterionValue = existingFilter.value;
            }

            let updatedFilterCriterionConfiguration = filterCriterionViewConfiBuilder
                .withConfig(filterCriterionConfiguration)
                .withValue(existingCriterionValue)
                .build();
            if(updatedFilterCriterionConfiguration) {
                updatedFilterCriterionConfiguration.enable = true;
                filterCriterionConfiguration = updatedFilterCriterionConfiguration;
            } else {
                filterCriterionConfiguration.enable = false;
            }
        });

        return this.filterConfiguration;
    }
}

