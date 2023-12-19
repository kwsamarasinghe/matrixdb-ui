import React, {useEffect, useRef, useState} from 'react';
import {createPluginUI} from 'molstar/lib/mol-plugin-ui';
import { ObjectKeys } from 'molstar/lib/mol-util/type-helpers';
import { PluginLayoutControlsDisplay } from 'molstar/lib/mol-plugin/layout';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { PluginBehaviors } from 'molstar/lib/mol-plugin/behavior';
import {Paper} from "@mui/material";
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
import "molstar/build/viewer/molstar.css"


const DefaultViewerOptions = {
    extensions: ObjectKeys({}),
    layoutIsExpanded: true,
    layoutShowControls: false,
    layoutShowRemoteState: true,
    layoutControlsDisplay: 'reactive' as PluginLayoutControlsDisplay,
    layoutShowSequence: false,
    layoutShowLog: false,
    layoutShowLeftPanel: false,

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
    const [selectedPDB, setSelectedPDB] = useState<string>();

    const handleOptionChange = (event : any) => {
        setSelectedPDB(event.target.value);
    };

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

            let pdb = props.pdb;
            if(Array.isArray(pdb)) {
                setPDBIds(pdb);
                setSelectedPDB(pdb[0]);
            } else {
                setPDBIds([pdb]);
                setSelectedPDB(pdb);
            }

            if(selectedPDB) {
                createPluginUI(viewerContainer.current, spec, {
                    onBeforeUIRender: plugin => {
                        plugin.builders.structure.representation.registerPreset(StructureRepresentationPresetProvider({
                            id: 'preset-structure-representation-viewer-auto',
                            display: {
                                name: 'Automatic (w/ Annotation)', group: 'Annotation',
                                description: 'Show standard automatic representation but colored by quality assessment (if available in the model).'
                            },
                            isApplicable(a) {
                                return (
                                    !!a.data.models.some(m => QualityAssessment.isApplicable(m, 'pLDDT')) ||
                                    !!a.data.models.some(m => QualityAssessment.isApplicable(m, 'qmean'))
                                );
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
                    if(selectedPDB) {
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
                                plugin.builders.structure.parseTrajectory(data, "mmcif")
                                    .then((trajectory: any) => {
                                        plugin.builders.structure.hierarchy.applyPreset(trajectory, 'all-models', {useDefaultIfSingleModel: true});
                                    });
                            });
                    }
                });
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

    return (
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
                        </span>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 0.5 }}>
                            <div style={{padding: '10px' }}>
                                <select
                                    value={selectedPDB}
                                    onChange={handleOptionChange}>
                                    {
                                        pdbIds.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))
                                    }
                                </select>
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
                            {/* Your existing inner div */}
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    );
};

export default StructureViewerComponent;
