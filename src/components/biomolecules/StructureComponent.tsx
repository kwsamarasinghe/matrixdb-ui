import React, { useEffect, useRef } from 'react';
import {createPluginUI} from 'molstar/lib/mol-plugin-ui';
import { ObjectKeys } from 'molstar/lib/mol-util/type-helpers';
import { PluginLayoutControlsDisplay } from 'molstar/lib/mol-plugin/layout';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { PluginBehaviors } from 'molstar/lib/mol-plugin/behavior';
import {Paper} from "@mui/material";
import {DownloadStructure, PdbDownloadProvider} from "molstar/lib/mol-plugin-state/actions/structure";
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


interface StructureViewerProps {
    pdbId: string;
}

const DefaultViewerOptions = {
    extensions: ObjectKeys({}),
    layoutIsExpanded: true,
    layoutShowControls: false,
    layoutShowRemoteState: true,
    layoutControlsDisplay: 'reactive' as PluginLayoutControlsDisplay,
    layoutShowSequence: true,
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

const StructureViewerComponent: React.FC<StructureViewerProps> = ({ pdbId }) => {
    const viewerContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewerContainer.current) {
            const o = {
                ...DefaultViewerOptions, ...{
                    layoutIsExpanded: false,
                    layoutShowControls: false,
                    layoutShowRemoteState: true,
                    layoutShowSequence: true,
                    layoutShowLog: false,
                    layoutShowLeftPanel: false,

                    viewportShowExpand: true,
                    viewportShowControls: false,
                    viewportShowSettings: false,
                    viewportShowSelectionMode: true,
                    viewportShowAnimation: false,
                }
            };
            const defaultSpec = DefaultPluginUISpec();

            const spec: PluginUISpec = {
                actions: defaultSpec.actions,
                behaviors: [
                    PluginSpec.Behavior(PluginBehaviors.Representation.HighlightLoci, {mark: false}),
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

            /*const loadPdb = (pdb: string, options?: LoadStructureOptions) => {
                const params = DownloadStructure.createDefaultParams(this.plugin.state.data.root.obj!, this.plugin);
                const provider = this.plugin.config.get(PluginConfig.Download.DefaultPdbProvider)!;
                return this.plugin.runTask(this.plugin.state.data.applyAction(DownloadStructure, {
                    source: {
                        name: 'pdb' as const,
                        params: {
                            provider: {
                                id: pdb,
                                server: {
                                    name: provider,
                                    params: PdbDownloadProvider[provider].defaultValue as any
                                }
                            },
                            options: { ...params.source.params.options, representationParams: options?.representationParams as any },
                        }
                    }
                }));
            }*/

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
                                return await QualityAssessmentPLDDTPreset.apply(ref, params, plugin);
                            } else if (!!structure.models.some(m => QualityAssessment.isApplicable(m, 'qmean'))) {
                                return await QualityAssessmentQmeanPreset.apply(ref, params, plugin);
                            } else if (!!structure.models.some(m => SbNcbrPartialChargesPropertyProvider.isApplicable(m))) {
                                return await SbNcbrPartialChargesPreset.apply(ref, params, plugin);
                            } else {
                                return await PresetStructureRepresentations.auto.apply(ref, params, plugin);
                            }
                        }
                    }));

                }
            }).then((plugin) => {
                plugin.builders.data.download(
                      {
                          url: "https://www.ebi.ac.uk/pdbe/entry-files/download/1tqn.bcif",
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
                              })

                  })

            })
        }
    }, []);

    const paperStyle = {
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '3px 3px 8px rgba(0, 0, 0, 0.3)',
        padding: '16px',
        height: '500px',
        width: '100%',
        borderRadius: 0
    };

    return (
        <div style={{
            position: "relative",
            height: '500px'
        }}>
            <Paper style={paperStyle}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#e1ebfc' }}>
                    <span style={{paddingLeft: '10px'}}>
                        <h3>3D Structure</h3>
                    </span>
                </div>
                <div
                    ref={viewerContainer}
                    style={{
                        position: "relative",
                        zIndex: 0,
                        height: '450px'
                    }}></div>
            </Paper>
        </div>
    );
};

export default StructureViewerComponent;
