import cesium, {DataSource, Entity, Primitive} from "cesium";
import * as React from "react";
import {CesiumComponentRef} from "resium";

type MapAsset = Entity|DataSource|Primitive;

interface MapToolBoxParams {
    entities: MapAsset[],
    setEntities: Function,
    viewerReference: React.RefObject<CesiumComponentRef<cesium.Viewer>>
}