import React, {useEffect, useRef, useState} from "react";
import "cesium/Source/Widgets/widgets.css";
import {CesiumComponentRef, Entity, Viewer} from "resium";
import {PointGraphics} from "cesium";
import { Viewer as CesiumViewer } from "cesium";
import * as cesium from "cesium";
import MapToolBox from "./ToolBox";
import {MapAsset} from "../../types/map";
import APIConnectorBox from "./APIConnectorBox";


const initialEntities: cesium.Entity[] = [
    new cesium.Entity({
        id: 'entity-1',
        name: 'Entity-1',
        position: cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 100) as unknown as cesium.PositionProperty,
        point: {
            pixelSize: 10 as unknown as cesium.Property,
            color: cesium.Color.YELLOW as unknown as cesium.Property
        } as PointGraphics
    }),
    new cesium.Entity({
        id: 'entity-2',
        name: 'Entity-2',
        position: cesium.Cartesian3.fromDegrees(-75.59777, 40.05883, 100) as unknown as cesium.PositionProperty,
        point: {
            pixelSize: 10 as unknown as cesium.Property,
            color: cesium.Color.RED as unknown as cesium.Property
        } as PointGraphics
    }),
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
    const [assets, setAssets] = useState<MapAsset[]>([]);
    useEffect(() => {
        if (ref.current) {
            const element = ref.current as CesiumComponentRef<cesium.Viewer>;
            if (element.cesiumElement) {
                setAssets(initialEntities);
            }
        }
    }, []);

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
                    baseLayerPicker={false}
                    animation={false}
                    timeline={false}
                    navigationHelpButton={false}
                    navigationInstructionsInitiallyVisible={false}
                    creditContainer={document.createElement('div')
            }>
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
