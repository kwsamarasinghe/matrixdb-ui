import React from "react";
import {Autocomplete, Button, Chip, Divider, Paper, Slider, TextField, Typography} from "@mui/material";
import {FilterCriterionConfiguration, FilterOptionType} from "./FilterConfigurationManager";

export const ReadOnlyFilterCriterionComponent: React.FC<any> = ({
                                                             filterType,
                                                             criterion,
                                                        }) => {
    const {label, value} = criterion;

    return(
        <Paper
            square
            style={{
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
            <div>
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {label}
                </Typography>
            </div>
            <Divider style={{ width: '40%', backgroundColor: 'black', margin: '1px 0' }} />
            <div style={{
                paddingTop: '10px'
            }}>
                <Typography variant="body1">
                    <Chip label={value} color="primary" />
                </Typography>
            </div>
        </Paper>
    )

}

export const EditingFilterCriterionComponent: React.FC<any> = ({
                                                            filterType,
                                                            criterion,
                                                            onValueChanged
                                                        }) => {
    const {id, label, options} = criterion;

    return(
        <Paper
            square
            style={{
                padding: '10px',
                margin: '5px',
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                height: 'auto'
            }}>
            <div>
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {label}
                </Typography>
            </div>
            <Divider style={{ width: '40%', backgroundColor: 'black', margin: '1px 0' }} />
            <div style={{
                paddingTop: '10px'
            }}>
                {
                    options && options.length > 0 &&
                    <Autocomplete
                        size={"small"}
                        id={id}
                        options={options}
                        style={{width: '200px', height: '30px'}}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                            />
                        )}
                        onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => onValueChanged(filterType, {
                            id: id,
                            value: newValue
                        })}
                    />
                }
            </div>
        </Paper>
    )
}

export const FilterWithSubCriteriaComponent: React.FC<FilterCriterionProps> = ({
                                                    filterType,
                                                    criterion,
                                                    onAdd
                                                })  => {
    const {id, label, options, subCriteria, value} = criterion;

    if(value) {
        return(
            <ReadOnlyFilterCriterionComponent
                criterion={criterion}
            />
        )
    } else {
        return(
            <>
                <div style={{
                    display: 'flex',
                    marginRight: '10px',
                    marginTop: '10px',
                    marginBottom: '10px'
                }}>
                    <Typography
                        variant='caption'
                        fontWeight='bold'
                    >
                        {label}
                    </Typography>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {
                        subCriteria && subCriteria.map((filterCriterionConfiguration: FilterCriterionConfiguration) => {
                            const {label, value, options} = filterCriterionConfiguration;
                            return(
                                <div style={{
                                    display: 'flex',
                                    paddingTop: '5px',
                                    height: '45px'
                                }}>
                                    <div style={{ width: '40%', marginRight: '10px' }}>
                                        <Typography variant="caption">{label}</Typography>
                                    </div>
                                    {
                                        value && (
                                            <div style={{ width: '60%' }}>
                                                {value}
                                            </div>
                                        )
                                    }
                                    {
                                        options && options.range && options.range.length > 0 && options.type === FilterOptionType.list && (
                                            <Autocomplete
                                                size="small"
                                                id={id}
                                                options={options.range}
                                                style={{ width: '200px', height: '30px' }}
                                                renderInput={(params) => (
                                                    <TextField {...params} variant="outlined" />
                                                )}
                                                onChange={(event, newValue) =>
                                                    onAdd(filterType, { id: id, value: newValue })
                                                }
                                            />
                                        )
                                    }
                                    {
                                        options && options.range && options.range.length > 0 && options.type === FilterOptionType.numeric && (
                                            <div style={{ width: '40%' }}>
                                                <Slider
                                                    defaultValue={1}
                                                    min={0}
                                                    max={1}
                                                    step={0.1}
                                                    valueLabelDisplay='auto'
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </>
        );
    }
}

export const EditingSubCriteriaComponent: React.FC<any> = ({
                                                        filterType,
                                                        criterion,
                                                        onValueChanged
                                                    })  => {
    const {label, subCriteria} = criterion;
    return(
        <Paper
            square
            style={{
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
            <div>
                <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {label}
                </Typography>
            </div>
            <Divider style={{ width: '40%', backgroundColor: 'black', margin: '1px 0' }} />
            {
                subCriteria && subCriteria.map((subCriterion: FilterCriterionConfiguration) => (
                    <div style={{
                        paddingTop: '10px'
                    }}>
                        <FilterCriterionComponent
                            filterType={filterType}
                            criterion={subCriterion}
                            onAdd={onValueChanged}
                        />
                    </div>
                ))
            }
        </Paper>
    )
}

interface FilterCriterionProps {
    filterType: string,
    criterion: FilterCriterionConfiguration,
    onAdd: (filterType: string, data: { id: string; value: string | null }) => void;
}
const FilterCriterionComponent: React.FC<FilterCriterionProps> = ({
                                                filterType,
                                                criterion,
                                                onAdd}) => {

    const {id, label, options, value} = criterion;

    return(
        <div style={{
            display: 'flex',
            height: '50px'
        }}>
            <div style={{ width: '40%', marginRight: '10px' }}>
                <Typography
                    variant='caption'
                    fontWeight='bold'
                >
                    {label}
                </Typography>
            </div>
            {
                options && options.range && options.range.length > 0 && options.type === FilterOptionType.list && (
                    <Autocomplete
                        size="small"
                        id={id}
                        options={options.range}
                        value={value}
                        style={{ width: '200px', height: '30px' }}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
                        )}
                        onChange={(event, newValue) =>
                            onAdd(filterType, { id: id, value: newValue })
                        }
                    />
                )
            }
            {
                options && options.range && options.range.length > 0 && options.type === FilterOptionType.numeric && (
                    <div style={{ width: '40%' }}>
                        <Slider
                            defaultValue={0}
                            min={0}
                            max={1}
                            step={0.1}
                            valueLabelDisplay='auto'
                        />
                    </div>
                )
            }
        </div>
    );
}

export default FilterCriterionComponent;