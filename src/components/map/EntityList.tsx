import "cesium/Source/Widgets/widgets.css";
import * as React from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import {Entity} from "cesium";
import NewEntityModal from "./NewEntity";

export default function EntityListHTML(props: {entities: Entity[]}) {
    const [open, setOpen] = React.useState(false);

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
                    <ListItem key={entity.id}
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
            <NewEntityModal open={open} setOpen={setOpen}/>
        </div>
    );
}
