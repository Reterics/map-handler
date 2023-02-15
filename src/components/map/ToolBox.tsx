import * as React from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import {Entity} from "cesium";
import EntityListHTML from "./EntityList";

export default function MapToolBox(props: {entities: Entity[]}) {
    return (
        <Tabs
            size="sm"
            aria-label="Toolbox"
            defaultValue={0}
            sx={(theme) => ({
                width: 260,
                height: "30vh",
                right: 10,
                bottom: 40,
                position: "fixed",
                backgroundColor: '#ffffffcc',
                color: "black",
                '--Tabs-gap': '0px',
                borderRadius: 'sm',
                boxShadow: 'sm',
                overflow: 'auto',
                border: `1px solid ${theme.vars.palette.divider}`,
            })}
        >
            <TabList>
                <Tab sx={{ py: 1.5 }}>Layers</Tab>
                <Tab>Map</Tab>
                <Tab>Others</Tab>
            </TabList>
            <TabPanel value={0} sx={{ p: 3 }} style={{padding: 0}}>
                <EntityListHTML entities={props.entities}/>
            </TabPanel>
            <TabPanel value={1} sx={{ p: 3 }}>

                <Typography level="inherit">
                    Map settings will be here
                </Typography>
            </TabPanel>
            <TabPanel value={2} sx={{ p: 3 }}>
                <Typography level="inherit">
                    Other things for later
                </Typography>

            </TabPanel>
        </Tabs>
    );
}
