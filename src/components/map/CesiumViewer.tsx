import React, {useRef, useState} from "react";
import "cesium/Source/Widgets/widgets.css";
import {Camera, CesiumComponentRef, Entity, Globe, Scene, Viewer} from "resium";
import * as cesium from "cesium";
import {SceneMode, Viewer as CesiumViewer} from "cesium";
import MapToolBox from "./ToolBox";
import {MapAsset} from "../../types/map";
import APIConnectorBox from "./APIConnectorBox";
import {getImageryProviderViewModels} from "../../lib/getImageryProviderViewModels";


const initialEntities: cesium.Entity[] = [
    new cesium.Entity({
        id: 'entity-3',
        name: 'Ferihegy Airport',
        position: cesium.Cartesian3.fromDegrees( 19.245164996920238, 47.43693475072539, 100),
        description: "BUD- Budapest Ferihegy Airport Description should be here",
        point: {
            pixelSize: 10,
            color: cesium.Color.RED
        }
    })
];

export function CesiumViewerComponent() {
    const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);
    const [assets, setAssets] = useState<MapAsset[]>(initialEntities);

    cesium.Camera.DEFAULT_VIEW_RECTANGLE = cesium.Rectangle.fromDegrees(14.0, 48, 24.91, 45.74);
    cesium.Camera.DEFAULT_VIEW_FACTOR = 0;

    const imageryProviders = getImageryProviderViewModels();

    const entities = assets.reduce((array, asset) => {
        if (asset instanceof cesium.Entity) {
            array.push(asset);
        }
        if (asset instanceof cesium.GeoJsonDataSource) {
            asset.entities.values.forEach((entity) => array.push(entity))
        }
        return array;
    }, [] as cesium.Entity[]) as cesium.Entity[];

    return (
        <div>
            <Viewer ref={ref} full
                    baseLayerPicker={true}
                    animation={false}
                    timeline={false}
                    navigationHelpButton={false}
                    navigationInstructionsInitiallyVisible={false}
                    imageryProviderViewModels={imageryProviders}
                    selectedImageryProviderViewModel={imageryProviders[2]}
                    sceneMode={SceneMode.SCENE2D}
                    creditContainer={document.createElement('div')
            }>
                <Scene/>
                <Globe/>
                <Camera/>
                {entities.map((entity, index)=>(
                    <Entity key={index} position={entity.position}
                            id={entity.id} description={entity.description}
                            point={entity.point}
                            box={entity.box}
                            corridor={entity.corridor}
                            cylinder={entity.cylinder}
                            ellipse={entity.ellipse}
                            ellipsoid={entity.ellipsoid}
                            label={entity.label}
                            path={entity.path}
                            plane={entity.plane}
                            polygon={entity.polygon}
                            polyline={entity.polyline}
                            polylineVolume={entity.polylineVolume}
                            rectangle={entity.rectangle}
                            tileset={entity.tileset}
                            billboard={entity.billboard}
                            wall={entity.wall}
                            properties={entity.properties}
                    />
                ))}
            </Viewer>
            <MapToolBox entities={assets} setEntities={setAssets} viewerReference={ref}/>
            <APIConnectorBox assets={assets} setAssets={setAssets} />
        </div>
    );
}
