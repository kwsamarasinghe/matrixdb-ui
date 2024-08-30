import React, {useEffect, useRef, useState} from 'react';
import {createPluginUI} from 'molstar/lib/mol-plugin-ui';
import { ObjectKeys } from 'molstar/lib/mol-util/type-helpers';
import { PluginLayoutControlsDisplay } from 'molstar/lib/mol-plugin/layout';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { PluginBehaviors } from 'molstar/lib/mol-plugin/behavior';
import {Button, CircularProgress, Paper} from "@mui/material";
import {
    PresetStructureRepresentations,
    StructureRepresentationPresetProvider
} from "molstar/lib/mol-plugin-state/builder/structure/representation-preset";
import {QualityAssessment} from "molstar/lib/extensions/model-archive/quality-assessment/prop";
import {StateObjectRef} from "molstar/lib/mol-state";
import {
    QualityAssessmentPLDDTPreset,
    QualityAssessmentQmeanPreset
} from "molstar/lib/extensions/model-archive/quality-assessment/behavior";
import {SbNcbrPartialChargesPreset, SbNcbrPartialChargesPropertyProvider} from "molstar/lib/extensions/sb-ncbr";
import "molstar/build/viewer/molstar.css";
import pdblogo from "../../assets/images/pdb.png";
import SelectableList from "../commons/lists/SelectableList";
import {StructureSelectionQueries} from "molstar/lib/mol-plugin-state/helpers/structure-selection-query";
import {QueryContext} from "molstar/lib/mol-model/structure/query/context";
import {Color} from "molstar/lib/mol-util/color";
import {setStructureOverpaint} from "molstar/lib/commonjs/mol-plugin-state/helpers/structure-overpaint";
import {StructureSelection} from "molstar/lib/mol-model/structure/query";
import {Loci} from "molstar/lib/mol-model/loci";
import {Script} from "molstar/lib/mol-script/script";
import getStructureSelection = Script.getStructureSelection;
import http from "../../commons/http-commons";


const DefaultViewerOptions = {
    extensions: ObjectKeys({}),
    layoutIsExpanded: true,
    layoutShowControls: true,
    layoutShowRemoteState: true,
    layoutControlsDisplay: 'reactive' as PluginLayoutControlsDisplay,
    layoutShowSequence: true,
    layoutShowLog: false,
    layoutShowLeftPanel: true,

    viewportShowExpand: PluginConfig.Viewport.ShowExpand.defaultValue,
    viewportShowControls: PluginConfig.Viewport.ShowControls.defaultValue,
    viewportShowSettings: PluginConfig.Viewport.ShowSettings.defaultValue,
    viewportShowSelectionMode: PluginConfig.Viewport.ShowSelectionMode.defaultValue,
    viewportShowAnimation: PluginConfig.Viewport.ShowAnimation.defaultValue,
    pluginStateServer: PluginConfig.State.DefaultServer.defaultValue,
    volumeStreamingServer: PluginConfig.VolumeStreaming.DefaultServer.defaultValue,
    pdbProvider: PluginConfig.Download.DefaultPdbProvider.defaultValue,
    emdbProvider: PluginConfig.Download.DefaultEmdbProvider.defaultValue,
};

const StructureViewerComponent: React.FC<any> = (props: any) => {
    const viewerContainer = useRef<HTMLDivElement>(null);
    const [pdbIds, setPDBIds] = useState<Array<string>>([]);
    const [plugin, setPlugin] = useState<any>(null);
    const [selectedPDB, setSelectedPDB] = useState<string>();
    const [loaded, setLoaded] = useState(false);

    const handleOptionChange = (pdb : any) => {
        setSelectedPDB(pdb);
    };

    useEffect(() => {
        let pdb = props.pdb;
        let pdbRegionMap: { [key: string]: any[] } = {};
        pdb.forEach((pdb: any) => {
            pdb.properties.forEach((pdbProperty: any) => {
                if(pdbProperty.type === "chains") {
                    let chains = [];
                    if(pdbProperty.value.split(',').length > 0) {
                        chains = pdbProperty.value.split(',');
                    } else {
                        chains = [pdbProperty.value];
                    }
                    chains.forEach((chain:any) => {
                        let value = chain.match('[0-9].*')[0];
                        let start = parseInt(value.split('-')[0]);
                        let end = parseInt(value.split('-')[1]);
                        let region = `${start}-${end}`;
                        if(!(region in pdbRegionMap)) {
                            pdbRegionMap[region] = [];
                        }
                        pdb.chain = chain.split("=")[0];
                        pdbRegionMap[region].push(pdb);
                    });
                }
            })
        });

        // Check for relevant binding regions
        http.get(`/biomolecules/${props.biomolecule}/binding-regions`)
            .then((response: any) => {

                response.data.forEach((bindingRegion: any) => {
                    let region = bindingRegion.featur_value;
                    let regionStart = parseInt(region.split('-')[0]);
                    let regionEnd = parseInt(region.split('-')[1]);

                    Object.keys(pdbRegionMap).forEach((region: string) => {
                        let start = parseInt(region.split('-')[0]);
                        let end = parseInt(region.split('-')[1]);
                        if(regionStart >= start && regionEnd <= end) {
                            pdbRegionMap[`${start}-${end}`].forEach((pdb: any) => {
                                if(!pdb.bindingRegions) pdb.bindingRegions = [];
                                let existing = pdb.bindingRegions.filter((region:any) => region.start === regionStart && region.end === regionEnd);
                                if(existing.length === 0) {
                                    pdb.bindingRegions.push({
                                        start: regionStart,
                                        end: regionEnd,
                                        chain: pdb.chain.toUpperCase()
                                    });
                                }
                            });
                        }
                    });
                });

                if(Array.isArray(pdb)) {
                    setPDBIds(pdb);
                    setSelectedPDB(pdb[0].id);
                } else {
                    setPDBIds([pdb]);
                    setSelectedPDB(pdb);
                }}
            );
    }, []);

    useEffect(() => {
        if (viewerContainer.current) {
            const o = {
                ...DefaultViewerOptions, ...{
                    layoutIsExpanded: false,
                    layoutShowControls: false,
                    layoutShowRemoteState: false,
                    layoutShowSequence: false,
                    layoutShowLog: false,
                    layoutShowLeftPanel: false,

                    viewportShowExpand: true,
                    viewportShowControls: false,
                    viewportShowSettings: false,
                    viewportShowSelectionMode: false,
                    viewportShowAnimation: false,
                }
            };
            const defaultSpec = DefaultPluginUISpec();

            const spec: PluginUISpec = {
                actions: defaultSpec.actions,
                behaviors: [
                    PluginSpec.Behavior(PluginBehaviors.Representation.HighlightLoci, {mark: true}),
                    PluginSpec.Behavior(PluginBehaviors.Representation.DefaultLociLabelProvider),
                    PluginSpec.Behavior(PluginBehaviors.Camera.FocusLoci),

                    PluginSpec.Behavior(PluginBehaviors.CustomProps.StructureInfo),
                    PluginSpec.Behavior(PluginBehaviors.CustomProps.Interactions),
                    PluginSpec.Behavior(PluginBehaviors.CustomProps.SecondaryStructure),
                ],
                animations: defaultSpec.animations,
                customParamEditors: defaultSpec.customParamEditors,
                layout: {
                    initial: {
                        isExpanded: o.layoutIsExpanded,
                        showControls: o.layoutShowControls,
                        controlsDisplay: o.layoutControlsDisplay,
                    },
                },
                components: {
                    ...defaultSpec.components,
                    controls: {
                        ...defaultSpec.components?.controls,
                        top: o.layoutShowSequence ? undefined : 'none',
                        bottom: o.layoutShowLog ? undefined : 'none',
                        left: o.layoutShowLeftPanel ? undefined : 'none',
                    },
                    remoteState: o.layoutShowRemoteState ? 'default' : 'none',
                },
                config: [
                    [PluginConfig.Viewport.ShowExpand, o.viewportShowExpand],
                    [PluginConfig.Viewport.ShowControls, o.viewportShowControls],
                    [PluginConfig.Viewport.ShowSettings, o.viewportShowSettings],
                    [PluginConfig.Viewport.ShowSelectionMode, o.viewportShowSelectionMode],
                    [PluginConfig.Viewport.ShowAnimation, o.viewportShowAnimation],
                    [PluginConfig.State.DefaultServer, o.pluginStateServer],
                    [PluginConfig.State.CurrentServer, o.pluginStateServer],
                    [PluginConfig.VolumeStreaming.DefaultServer, o.volumeStreamingServer],
                    [PluginConfig.Download.DefaultPdbProvider, o.pdbProvider],
                    [PluginConfig.Download.DefaultEmdbProvider, o.emdbProvider],
                ]
            };

            //if(selectedPDB) {
            createPluginUI(viewerContainer.current, spec, {
                onBeforeUIRender: plugin => {
                    plugin.builders.structure.representation.registerPreset(StructureRepresentationPresetProvider({
                        id: 'preset-structure-representation-viewer-auto',
                        display: {
                            name: 'Automatic (w/ Annotation)', group: 'Annotation',
                            description: 'Show standard automatic representation but colored by quality assessment (if available in the model).'
                        },
                        isApplicable(a) {
                            return (a.data.models.some(m => QualityAssessment.isApplicable(m, 'pLDDT')) || a.data.models.some(m => QualityAssessment.isApplicable(m, 'qmean')));
                        },
                        params: () => StructureRepresentationPresetProvider.CommonParams,
                        async apply(ref, params, plugin) {
                            const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref);
                            const structure = structureCell?.obj?.data;
                            if (!structureCell || !structure) return {};

                            if (!!structure.models.some(m => QualityAssessment.isApplicable(m, 'pLDDT'))) {
                                return QualityAssessmentPLDDTPreset.apply(ref, params, plugin);
                            } else if (!!structure.models.some(m => QualityAssessment.isApplicable(m, 'qmean'))) {
                                return QualityAssessmentQmeanPreset.apply(ref, params, plugin);
                            } else if (!!structure.models.some(m => SbNcbrPartialChargesPropertyProvider.isApplicable(m))) {
                                return SbNcbrPartialChargesPreset.apply(ref, params, plugin);
                            } else {
                                return PresetStructureRepresentations.auto.apply(ref, params, plugin);
                            }
                        }
                    }));

                }
            }).then((plugin) => {
                setPlugin(plugin);
            });
            //}

        }
    }, []);

    useEffect(() => {
        if(selectedPDB && plugin) {
            plugin.clear()
            try {
                plugin.builders.data.download(
                    {
                        url: "https://www.ebi.ac.uk/pdbe/entry-files/download/" + selectedPDB.toLowerCase() + ".bcif",
                        isBinary: true
                    },
                    {
                        state:
                            {
                                isGhost: true
                            }
                    }
                )
                    .then((data: any) => {
                        if(data) {
                            setLoaded(true);
                            plugin.builders.structure.parseTrajectory(data, "mmcif")
                                .then((trajectory: any) => {
                                    //plugin.builders.structure.hierarchy.applyPreset(trajectory, 'all-models', {useDefaultIfSingleModel: true});

                                    // Specify the model index you want to load, e.g., 0 for the first model
                                    const modelIndex = 0;

                                    // Create a model from the trajectory using the specified model index
                                    plugin.builders.structure.createModel(trajectory, { modelIndex })
                                        .then((model: any) => {
                                            // Create a structure from the selected model
                                            plugin.builders.structure.createStructure(model)
                                                .then((structure: any) => {
                                                    // Apply the desired representation to the structure
                                                    plugin.builders.structure.representation.applyPreset(structure, 'auto');
                                                });
                                        });
                                });

                            plugin.canvas3d?.events?.hover.subscribe((e: any) => {
                                // Prevent hover events from affecting persistent highlights
                                e.preventDefault();  // Or handle it based on your specific use case
                            });

                            plugin.managers.interactivity.lociHighlights.clearHighlights();
                        }
                    });
            } catch(e: any) {
                plugin.clear()
            }
        }
    }, [selectedPDB]);

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        height: '600px',
        width: '100%',
        borderRadius: 0
    };

    const highlightRegion = (start: number, end: number) =>  {
        const data = plugin.managers.structure.hierarchy.current.structures[0]?.cell.obj?.data;
        if (!data) return;

        const seq_id_start = start;  // Start of range
        const seq_id_end = end;   // End of range
        const sel = Script.getStructureSelection(Q => Q.struct.generator.atomGroups({
            'residue-test': Q.core.rel.inRange([Q.struct.atomProperty.macromolecular.label_seq_id(), seq_id_start, seq_id_end]),
            'group-by': Q.struct.atomProperty.macromolecular.residueKey()
        }), data);

        const loci = StructureSelection.toLociWithSourceUnits(sel);
        plugin.managers.interactivity.lociHighlights.highlight({ loci });
    }

    return (
       <>
           {
                <div style={{
                    display: 'relative'
                }}>
                    <Paper style={paperStyle}>
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: '#e1ebfc'
                            }}>
                                    <span style={{
                                        paddingLeft: '10px'
                                    }}>
                                        <h3>3D Structures</h3>
                                        {!loaded && <CircularProgress size={25}/>}
                                    </span>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ flex: 0.5 }}>
                                    <div style={{padding: '10px' }}>
                                        <SelectableList
                                            selectedItem={selectedPDB}
                                            items={pdbIds}
                                            onItemChange={handleOptionChange}
                                            itemLogo={pdblogo}
                                            itemURL={'https://www.ebi.ac.uk/pdbe/entry/pdb/'}
                                            onHighlight={highlightRegion}
                                        />
                                    </div>
                                </div>
                                <div
                                    ref={viewerContainer}
                                    style={{
                                        position: "relative",
                                        zIndex: 0,
                                        flex: 2,
                                        height: '500px'
                                    }}
                                >
                                </div>
                            </div>
                        </div>
                    </Paper>
                </div>
            }
       </>
    );
};

export default StructureViewerComponent;
