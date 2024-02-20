import React, {useEffect, useState} from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {AppDispatch, RootState} from '../../../stateManagement/store';
import * as actions from '../../../stateManagement/actions';
import {Button, IconButton, Paper, Typography} from "@mui/material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAtom, faCircleNodes, faFilter, faCancel} from "@fortawesome/free-solid-svg-icons";
import {
    FilterConfiguration,
    FilterConfigurationManager,
    FilterCriterionConfiguration
} from "./FilterConfigurationManager";
import FilterManager, {Filter, FilterCriterion} from "./FilterManager";
import FilterCriterionComponent, {
    EditingFilterCriterionComponent, EditingSubCriteriaComponent
} from "./FilterCriterionComponent";

const mapStateToProps = (state: RootState) => ({
    currentState: state.currentState,
    filterConfiguration: state.filterConfiguration,
    filters: state.filters,
    network: state.network
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    addFilterCriterionAction: (filterConfiguration: FilterConfiguration) => dispatch(actions.addFilterCriteria(filterConfiguration)),
    updateFilterAction: (networkData: any) => dispatch(actions.setNetworkDataAction(networkData))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type NewFilterComponentProps = ConnectedProps<typeof connector>;
const NewFilterComponent: React.FC<NewFilterComponentProps> = ({
                                                            currentState,
                                                            filterConfiguration,
                                                            filters,
                                                            network,
                                                            updateFilterAction,
                                                      }) => {
    const [currentFilters, setCurrentFilters] = useState<Filter[]>(filters);
    const [currentFilterConfiguration, setCurrentFilterConfiguration]  = useState<FilterConfiguration>(filterConfiguration);
    const filterManager = new FilterManager(network);
    const filterConfigurationManger = new FilterConfigurationManager(network);

    useEffect(() => {
        let currentFilterConfiguration = filterConfigurationManger.getFilterConguration(currentFilters);
        setCurrentFilterConfiguration(currentFilterConfiguration);
    }, [currentFilters]);

    const onFilterTypeSelect = (filterType: string) => {
        let existingFilterTypes = new Set();
        currentFilters.forEach((filter) => existingFilterTypes.add([...Object.keys(filter)]));

        // Filter are empty
        if(!existingFilterTypes.has(filterType)) {
            let currentFilters : Filter[] = [];
            currentFilters.push({
                type: filterType,
                criteria: []
            });
            let currentFilterConfiguration = filterConfigurationManger.getFilterConguration(currentFilters);
            setCurrentFilterConfiguration(currentFilterConfiguration);
            setCurrentFilters(currentFilters);
        }

        // Filters exist and new type selected

    };

    const onFilterCriterionAdd = (filterType: string, filterCriterion: FilterCriterion) => {
        // Add criterion to the filters
        let lastFilter = currentFilters[currentFilters.length - 1];
        if(filterCriterion) {
            if(lastFilter.criteria.length > 0) {
                let lastFilterCriteria = lastFilter.criteria[lastFilter.criteria.length - 1];
                if(lastFilterCriteria.id === filterCriterion.id) {
                    lastFilterCriteria.value = filterCriterion.value;
                } else {
                    lastFilter.criteria.push(filterCriterion);
                }
            } else {
                lastFilter.criteria.push(filterCriterion);
            }
        }
        let currentFilterConfiguration = filterConfigurationManger.getFilterConguration(currentFilters);
        setCurrentFilterConfiguration(currentFilterConfiguration);
        setCurrentFilters(currentFilters);
    }

    return (
            <Paper
                square
                style={{
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}>
                {
                    <>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingBottom: '10px'
                        }}>
                            <Typography variant={'body1'}>
                                Filter Interactions
                            </Typography>
                        </div>
                        <div>
                            {
                                currentFilterConfiguration && Object.keys(currentFilterConfiguration).map((filterType:string) => (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="primary"
                                                style={{ borderColor: 'green', color: 'green', height: '30px' }}
                                                disabled={false}
                                                onClick={() => onFilterTypeSelect(filterType)}
                                            >
                                                <IconButton>
                                                    <FontAwesomeIcon icon={filterType === 'interactor' ? faAtom: faCircleNodes} size={"2xs"} color={'green'}/>
                                                </IconButton>
                                                {filterType}
                                            </Button>
                                        </div>
                                        {
                                            currentFilterConfiguration[filterType] &&
                                            <div>
                                                {currentFilterConfiguration[filterType]?.map((filterCriterionConfiguration: FilterCriterionConfiguration) => {

                                                    if(filterCriterionConfiguration?.options &&
                                                        filterCriterionConfiguration.options.length > 0) {
                                                        return(
                                                            <EditingFilterCriterionComponent
                                                                filterType={filterType}
                                                                criterion={filterCriterionConfiguration}
                                                                onValueChanged={onFilterCriterionAdd}
                                                            />
                                                        )
                                                    } else if(filterCriterionConfiguration?.subCriteria &&
                                                        filterCriterionConfiguration.subCriteria.length > 0 ){
                                                        return(
                                                            <EditingSubCriteriaComponent
                                                                filterType={filterType}
                                                                criterion={filterCriterionConfiguration}
                                                                onAdd={onFilterCriterionAdd}
                                                            />
                                                        )
                                                    } else {
                                                        return(
                                                            <FilterCriterionComponent
                                                                filterType={filterType}
                                                                criterion={filterCriterionConfiguration}
                                                                onAdd={onFilterCriterionAdd}
                                                            />
                                                        )
                                                    }

                                                })}
                                            </div>
                                        }
                                    </>
                                ))
                            }
                            {
                                currentFilters.length > 0 &&
                                <div style={{
                                    paddingTop: '20px'
                                }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        style={{
                                            marginRight: '10px',
                                            marginLeft: '5px'
                                        }}
                                        onClick={() => {setCurrentFilters([])}}
                                    >
                                        <IconButton>
                                            <FontAwesomeIcon
                                                icon={faCancel}
                                                size={"2xs"}
                                                color={'red'}
                                            />
                                        </IconButton>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="success"
                                        onClick={() => {}}
                                    >
                                        <IconButton>
                                            <FontAwesomeIcon
                                                icon={faFilter}
                                                size={"2xs"}
                                                color={'green'}
                                            />
                                        </IconButton>
                                        Apply
                                    </Button>
                                </div>
                            }
                        </div>
                    </>
                }
            </Paper>
    );
};

export default connector(NewFilterComponent);
