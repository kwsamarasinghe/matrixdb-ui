import React from "react";
import {Autocomplete, Button, Chip, Divider, Paper, TextField, Typography} from "@mui/material";
import {FilterCriterionConfiguration} from "./FilterConfigurationManager";

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

export const SubCriteriaComponent: React.FC<any> = ({
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
                    <div style={{ paddingTop: '10px' }}>
                        <Typography variant="body1">
                            <Chip label={subCriterion.value} color="primary" />
                        </Typography>
                    </div>
                ))
            }
        </Paper>
    )
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
                            criterion={subCriterion}
                        />
                    </div>
                ))
            }
        </Paper>
    )
}

const FilterCriterionComponent: React.FC<any> = ({
                                                     filterType,
                                                     criterion,
                                                     onAdd
                                                 }) => {

    const {id, label, options, value} = criterion;

    if(value) {
        return(
            <ReadOnlyFilterCriterionComponent
                criterion={criterion}
            />
        )
    } else {
        return(
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                paddingTop: '5px'
            }}>
                <div>
                    <Button
                        variant="outlined"
                        size="small"
                        style={{
                            borderColor: 'black',
                            color: 'black',
                            width: '150px',
                            whiteSpace: 'normal'
                        }}
                        disabled={false}
                        onClick={() => onAdd(filterType, {
                            id: id
                        })}
                    >
                        {label}
                    </Button>
                </div>
                {
                    value &&
                    <div>
                        {value}
                    </div>
                }
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
                        onChange={(event: React.ChangeEvent<{}>, newValue: string | null) => onAdd(filterType, {
                            id: id,
                            value: newValue
                        })}
                    />
                }
            </div>
        );
    }
}

export default FilterCriterionComponent;