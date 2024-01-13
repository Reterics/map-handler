import "cesium/Source/Widgets/widgets.css";
import * as React from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import cesium, {Entity} from "cesium";
import NewEntityModal from "./NewEntity";
import {CesiumComponentRef} from "resium";

export default function EntityListHTML(props: {entities: Entity[], viewerReference: React.RefObject<CesiumComponentRef<cesium.Viewer>>}) {
    const [open, setOpen] = React.useState(false);

    const onSubmit = () => {

    };

    const onSelectEntity = (entity: Entity) => {
        console.log('select');
        const cesiumRef = props.viewerReference.current as CesiumComponentRef<cesium.Viewer>;
        console.log(cesiumRef, entity);
        if (cesiumRef.cesiumElement) {
            const view = cesiumRef.cesiumElement;
            const selected = view.entities.getById(entity.id);
            if (selected) {
                cesiumRef.cesiumElement?.flyTo(selected);
            }
        }
    };

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
                {props.entities.map(entity=>(
                    <ListItem key={entity.id} onClick={()=>onSelectEntity(entity)}
                              endAction={
                                  <IconButton aria-label="Delete" size="sm" color="danger">
                                      <Delete />
                                  </IconButton>
                              }
                    >
                        <ListItemButton>{entity.name}</ListItemButton>
                    </ListItem>
                ))}
            </List>
            <NewEntityModal open={open} setOpen={setOpen} onSubmit={onSubmit}/>
        </div>
    );
}
