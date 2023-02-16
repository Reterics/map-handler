import React, {useEffect, useRef, useState} from "react";
import "cesium/Source/Widgets/widgets.css";
import {CesiumComponentRef, EntityDescription, Viewer, Entity} from "resium";
import cesium, {PointGraphics} from "cesium";
import {createWorldTerrain} from "cesium";
import { Viewer as CesiumViewer } from "cesium";
import * as Cesium from "cesium";
import MapToolBox from "./ToolBox";

const initialEntities: cesium.Entity[] = [
    {
        id: 'entity-1',
        name: 'Entity-1',
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883) as unknown as cesium.PositionProperty,
        point: {
            pixelSize: 10 as unknown as cesium.Property,
            color: Cesium.Color.YELLOW as unknown as cesium.Property
        } as PointGraphics
    } as cesium.Entity,
    {
        id: 'entity-2',
        name: 'Entity-2',
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.05883) as unknown as cesium.PositionProperty,
        point: {
            pixelSize: 10 as unknown as cesium.Property,
            color: Cesium.Color.RED as unknown as cesium.Property
        } as PointGraphics
    } as cesium.Entity,
    {
        id: 'entity-3',
        name: 'Ferihegy Airport',
        position: Cesium.Cartesian3.fromDegrees( 19.245164996920238, 47.43693475072539),
        description: "BUD- Budapest Ferihegy Airport Description should be here",
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED
        }
    } as unknown as cesium.Entity
];

export function CesiumViewerComponent() {
    const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);
    const [entities, setEntities] = useState<cesium.Entity[]>([]);
    useEffect(() => {
        if (ref.current) {
            const element = ref.current as CesiumComponentRef<cesium.Viewer>;
            if (element.cesiumElement) {
                setEntities(initialEntities);
            }
        }
    }, []);

    const terrainProvider = createWorldTerrain();


    return (
        <div>
            <Viewer ref={ref} full terrainProvider={terrainProvider} baseLayerPicker={false} animation={false} >
                {entities.map((entity, index)=>(
                    <Entity key={index} position={entity.position} point={entity.point} id={entity.id} description={entity.description}/>
                ))}
            </Viewer>
            <MapToolBox entities={entities} viewerReference={ref}/>
        </div>
    );
}
