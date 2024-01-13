import "cesium/Source/Widgets/widgets.css";
import * as React from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import * as cesium from "cesium";
import NewEntityModal from "./NewEntity";
import {CesiumComponentRef} from "resium";
import {MapAsset} from "../../types/map";
import {DataSource} from "cesium";

export default function EntityListHTML(props: {entities: MapAsset[], viewerReference: React.RefObject<CesiumComponentRef<cesium.Viewer>>}) {
    const [open, setOpen] = React.useState(false);

    const onSubmit = () => {

    };

    const onSelectEntity = async (entity: MapAsset) => {
        const cesiumRef = props.viewerReference.current as CesiumComponentRef<cesium.Viewer>;
        if (cesiumRef.cesiumElement) {
            const view = cesiumRef.cesiumElement;
            let selected;
            if (entity instanceof cesium.Entity) {
                selected = view.entities.getById(entity.id);
            } else if(entity instanceof cesium.GeoJsonDataSource) {
                selected = view.entities.getById(entity.entities.values[0].id);
            }

            if (selected) {
                void view?.flyTo(selected);
            }
        }
    };

    const listItems = [];


    return (
        <div>
            <List sx={{ maxWidth: 300 }}>
                <ListItem
                    startAction={
                        <IconButton aria-label="Add" size="sm" variant="plain" color="neutral">
                            <Add />
                        </IconButton>
                    }
                >
                    <ListItemButton onClick={() => setOpen(true)} >Add Layer</ListItemButton>
                </ListItem>
                {props.entities.map((entity, index)=>(
                    <ListItem key={'list-'+index} onClick={()=>onSelectEntity(entity)}
                              endAction={
                                  <IconButton aria-label="Delete" size="sm" color="danger">
                                      <Delete />
                                  </IconButton>
                              }
                    >
                        <ListItemButton>{!(entity instanceof cesium.Primitive) ? entity.name : 'Primitive'}</ListItemButton>
                    </ListItem>
                ))}
            </List>
            <NewEntityModal open={open} setOpen={setOpen} onSubmit={onSubmit}/>
        </div>
    );
}
