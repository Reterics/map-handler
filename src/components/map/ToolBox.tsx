import * as React from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import cesium from "cesium";
import EntityListHTML from "./EntityList";
import {FileUploadHTML, UploadedFile} from "../FileUpload";
import {CesiumComponentRef} from "resium";
import * as Cesium from "cesium";
import {convertKMZtoKML, mergeGltfAndBinContent} from "../../commons/data";

import "./ToolBox.css";
import {MapToolBoxParams} from "../../types/map";

export default function MapToolBox({entities, setEntities, viewerReference}: MapToolBoxParams) {

    const onUpload = async (fileList: UploadedFile[], e: React.MouseEvent<HTMLInputElement>, resetFiles:Function) => {
        const cesiumRef = viewerReference.current as CesiumComponentRef<cesium.Viewer>;
        if (!cesiumRef || !cesiumRef.cesiumElement) {
            return console.error('Reference is not defined');
        }
        const viewer = cesiumRef.cesiumElement as cesium.Viewer;

        const glb: ArrayBuffer[] = [];
        const gltfMerge:{gltf: string|null, bin: null|ArrayBuffer} = {
            gltf: null,
            bin: null
        }
        console.error(fileList);
        const decoder = new TextDecoder('utf-8');

        fileList.forEach((file, index) => {
            switch (file.type) {
                case 'gltf':
                    gltfMerge.gltf = file.content as string;
                    break;
                case 'bin':
                    gltfMerge.bin = file.content as ArrayBuffer;
                    break;
                case 'glb':
                    glb.push(file.content as ArrayBuffer);
                    break;
                case 'dae':

                    /*const model = Cesium.Model.fromColladaUrl("/path/to/model.dae");
                    viewer.scene.primitives.add(model);
                    glb.push(file.content as ArrayBuffer);*/
                    break;
                case 'kml':
                    if (file.content) {
                        const blob = new Blob([file.content], { type: "model/gltf+json" });
                        const blobUrl = URL.createObjectURL(blob);
                        void viewer.dataSources.add(Cesium.KmlDataSource.load(blobUrl,
                            {
                                camera: viewer.scene.camera,
                                canvas: viewer.scene.canvas
                            })
                        ).catch(e=>console.error(e))
                    }
                    break;
                case 'kmz':
                    if (file.content) {
                        convertKMZtoKML(file.content).then(kml=>{
                            const blob = new Blob([kml], { type: "model/gltf+json" });
                            const blobUrl = URL.createObjectURL(blob);
                            void viewer.dataSources.add(Cesium.KmlDataSource.load(blobUrl,
                                {
                                    camera: viewer.scene.camera,
                                    canvas: viewer.scene.canvas
                                })
                            );
                        })

                    }
                    break;
                case 'application/json':
                case 'geojson':
                    if (file.content && file.content instanceof ArrayBuffer) {
                        const blob = new Blob([file.content], { type: "application/json" });
                        const blobUrl = URL.createObjectURL(blob);
                        // const str = decoder.decode(file.content);

                        Cesium.GeoJsonDataSource.load(blobUrl).then(geoJONSource=>{
                            geoJONSource.name = file.name;
                            console.log(geoJONSource);
                            setEntities([...entities, geoJONSource]);
                            //viewer.dataSources.add(geoJONSource);
                        });
                    }
                    break;
            }
        });

        if (gltfMerge.gltf) {
            if (gltfMerge.bin) {
                glb.push(mergeGltfAndBinContent(gltfMerge.gltf, gltfMerge.bin))
            } else {
                const blob = new Blob([gltfMerge.gltf], { type: "model/gltf+json" });
                const blobUrl = URL.createObjectURL(blob);
                const resource = new Cesium.Resource({
                    url: gltfMerge.gltf,
                    retryAttempts: 1
                });
                const loadedModel = viewer.scene.primitives.add(Cesium.Model.fromGltfAsync({
                    url: resource,
                    show: true,
                    scale: 1.0,
                    scene: viewer.scene
                }));
                viewer.scene.primitives.add(loadedModel);
            }
        }

        if (glb.length) {
            glb.forEach(model => {
                const blob = new Blob([model], { type: "model/gltf-binary" });
                const blobUrl = URL.createObjectURL(blob);
                const resource = new Cesium.Resource({
                    url: blobUrl,
                    retryAttempts: 1
                });
                resource.fetch()?.then(a=>{console.error(a);})

                const loadedModel = viewer.scene.primitives.add(Cesium.Model.fromGltfAsync({
                    url: resource,
                    show: true,
                    scale: 1.0,
                    // position: Cesium.Cartesian3.fromDegrees( 19.245164996920238, 47.43693475072539, 50) as PositionProperty,
                    scene: viewer.scene
                }));
                viewer.scene.primitives.add(loadedModel);
            });
        }

        resetFiles();
    };

    return (
        <Tabs
            className="toolbox-container"
            size="sm"
            aria-label="Toolbox"
            defaultValue={0}
            sx={(theme) => ({
                width: 260,
                height: "30vh",
                right: 10,
                bottom: 40,
                position: "fixed",
                backgroundColor: 'rgba(38, 38, 38, 0.95)',
                color: "#edffff",
                '--Tabs-gap': '0px',
                boxShadow: 'sm',
                overflow: 'auto',
                border: `1px solid ${theme.vars.palette.divider}`,
            })}
        >
            <TabList id="tabList">
                <Tab>Layers</Tab>
                <Tab>Map</Tab>
                <Tab>Upload</Tab>
            </TabList>
            <TabPanel value={0} sx={{ p: 3 }} style={{padding: 0}}>
                <EntityListHTML entities={entities} viewerReference={viewerReference}/>
            </TabPanel>
            <TabPanel value={1} sx={{ p: 3 }}>

                <Typography level="inherit">
                    Map settings will be here
                </Typography>
            </TabPanel>
            <TabPanel value={2} sx={{ p: 3 }}>

                <FileUploadHTML onUpload={onUpload}/>

            </TabPanel>
        </Tabs>
    );
}
