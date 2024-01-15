import {
    ArcGisMapServerImageryProvider,
    buildModuleUrl, createWorldImageryAsync,
    defaultValue, ImageryProvider,
    IonImageryProvider,
    IonResource,
    IonWorldImageryStyle, OpenStreetMapImageryProvider,
    ProviderViewModel, TerrainProvider, TileMapServiceImageryProvider
} from "cesium";

function createWorldImagery(options: { style: any; }) {
    options = defaultValue(options, {});
    const style = defaultValue(options.style, IonWorldImageryStyle.AERIAL);
    return IonResource.fromAssetId(style) as unknown as Promise<ImageryProvider>
}

export function getImageryProviderViewModels() {
    var providerViewModels = [];
    providerViewModels.push(
        new ProviderViewModel({
            name: "Bing Maps Aerial",
            iconUrl: buildModuleUrl("Widgets/Images/ImageryProviders/bingAerial.png"),
            tooltip: "Bing Maps aerial imagery, provided by Cesium ion",
            category: "Cesium ion",
            creationFunction: function () {
                return createWorldImageryAsync({
                    style: IonWorldImageryStyle.AERIAL,
                })
            },
        })
    );

    providerViewModels.push(
        new ProviderViewModel({
            name: "Bing Maps Aerial with Labels",
            iconUrl: buildModuleUrl(
                "Widgets/Images/ImageryProviders/bingAerialLabels.png"
            ),
            tooltip: "Bing Maps aerial imagery with labels, provided by Cesium ion",
            category: "Cesium ion",
            creationFunction: function () {
                return createWorldImagery({
                    style: IonWorldImageryStyle.AERIAL_WITH_LABELS,
                });
            },
        })
    );


    providerViewModels.push(
        new ProviderViewModel({
            name: "Open\u00adStreet\u00adMap",
            iconUrl: buildModuleUrl(
                "Widgets/Images/ImageryProviders/openStreetMap.png"
            ),
            tooltip:
                "OpenStreetMap (OSM) is a collaborative project to create a free editable map \
        of the world.\nhttp://www.openstreetmap.org",
            category: "Other",
            creationFunction: function () {
                return new OpenStreetMapImageryProvider({
                    url: "https://a.tile.openstreetmap.org/",
                });
            },
        })
    );

    return providerViewModels;
}