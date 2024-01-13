import GUIBox from "./GUIBox";
import Stack from "@mui/joy/Stack";
import React, {useState} from "react";
import Add from '@mui/icons-material/Add';
import IconButton from "@mui/joy/IconButton";
import {Box} from "@mui/joy";
import { NativeSelect } from '@mui/material';
import AttachmentIcon from '@mui/icons-material/Attachment';
import SendIcon from '@mui/icons-material/Send';
import {ArrayBufferToString, browseFile} from "../../commons/data";


export default function APIConnectorBox() {

    const [values, setValues] = useState<ConnectorValue[]>([])
    const [mappings, setMappings] = useState<ConnectorMapping[]>([])
    const [target, setTarget] = useState<string>('https://<target-api>');
    const [method, setMethod] = useState<string>('get');


    const updateValue = (modifiedValue: ConnectorValue, index: number) => {
        const modifiedValues = values.map((value, i) => {
            if(i === index) {
                return modifiedValue;
            }
            return value;
        });
        setValues([...modifiedValues]);
    };
    const updateMapping = (modifiedMapping: ConnectorMapping, index: number) => {
        const modifiedValues = mappings.map((value, i) => {
            if(i === index) {
                return modifiedMapping;
            }
            return value;
        });
        setMappings([...modifiedValues]);
    };

    const queryData = async () => {
        console.log('Query the following:');
        console.log(method , target);
        console.log(values);
        console.log(mappings);

        const body: ConnectorBody = {};
        let query = '';

        values.forEach(data => {
            const value = data.type === 'number' ? Number(data.value) : data.value;

            if (data.place === 'query') {
                if (query) {
                    query+='&'+data.name+'='+value;
                } else {
                    query+='?'+data.name+'='+value;
                }
            } else if (data.place === 'body') {
                body[data.name] = value;
            }
        })

        const response = await fetch(target + query, {
            mode: 'cors',
            method: method,
            body: Object.keys(body).length ? JSON.stringify(body) : undefined,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            redirect: "follow"
        });

        if (response.status >= 200 && response.status < 300) {
            const body = await response.json();
            console.log(body);
        } else {
            console.error(response.status);
            const error = await response.text();
            console.error(error);
        }
    };

    const uploadConfig = async () => {
        const content = await browseFile();
        if (content) {
            let json;
            try {
                if (typeof content === "string") {
                    json = JSON.parse(content);
                } else {
                    json = JSON.parse(ArrayBufferToString(content));
                }
            } catch (e) {
                console.error(e);
            }
            if (json) {
                if (Array.isArray(json.values)) {
                    setValues(json.values as ConnectorValue[])
                }
                if (Array.isArray(json.mappings)) {
                    setMappings(json.mappings as ConnectorMapping[])
                }
                if (json.target) {
                    setTarget(json.target)
                }
                if (json.method) {
                    setMethod(json.method);
                }
            }
        }
    }

    return (
        <GUIBox title={"API Connector"} >
            <Stack>
                <Stack>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <h4 style={{marginTop: 0, marginBottom: 0}}>Target</h4>
                        <IconButton aria-label="Query" size="sm" variant="plain" color="neutral"
                                    onClick={()=>uploadConfig()}>
                            <AttachmentIcon />Upload Config</IconButton>
                    </Stack>
                    <Stack direction={"row"}>
                        <input name="name" type="text" style={{color: "#edffff"}}
                               value={target} placeholder={"Target"}
                               onChange={(e)=>{
                                   setTarget(e.target.value);
                               }}
                        />
                        <NativeSelect name="method" style={{
                            width: "50%",
                            color: "#edffff"
                        }} value={method}
                                      onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>{
                                          if (e && e.target) {
                                              setMethod(e.target.value);
                                          }
                                      }}>
                            <option value={"get"} style={{
                                backgroundColor: "gray"
                            }}>GET</option>
                            <option value={"post"} style={{
                                backgroundColor: "gray"
                            }}>POST</option>
                        </NativeSelect>
                    </Stack>

                </Stack>
                <Stack sx={{
                    width: '100%',
                    color: 'white',
                    marginTop: '1em'
                }}>
                    <Stack direction={"row"} width={"100%"} justifyContent={"space-evenly"}>
                        <Box>Name</Box>
                        <Box>Type</Box>
                        <Box>Value</Box>
                        <Box>Place</Box>
                    </Stack>
                    {values.map((value, index) => (
                        <Stack key={'value' + index} direction={"row"}>
                                <input name="name" type="text" style={{
                                    maxWidth: "25%",
                                    color: "#edffff"
                                }}
                                       value={value.name} placeholder={"Name"}
                                onChange={(e)=>{
                                    value.name = e.target.value;
                                    updateValue(value, index);
                                }}
                                />
                                <NativeSelect name="type" value={value.type} style={{
                                    maxWidth: "25%",
                                    color: "#edffff"
                                }}
                                onChange={e=>{
                                    if (e && e.target) {
                                        value.type = (e.target as HTMLSelectElement).value as ConnectorType;
                                        updateValue(value, index);
                                }} }>
                                    <option value={"text"} style={{
                                        backgroundColor: "gray"
                                    }}>Text</option>
                                    <option value={"number"} style={{
                                        backgroundColor: "gray"
                                    }}>Number</option>
                                </NativeSelect>

                                <input name="value" type={value.type} style={{
                                    maxWidth: "25%",
                                    color: "#edffff"
                                }}
                                       value={value.value} placeholder={"Value"}
                                       onChange={(e)=>{
                                           value.value = e.target.value;
                                           updateValue(value, index);
                                       }}
                                />
                                <NativeSelect name="place"  style={{
                                    maxWidth: "25%",
                                    color: "#edffff"
                                }}
                                              onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>{
                                    if (e && e.target) {
                                        value.place = e.target.value as ConnectorPlace;
                                        updateValue(value, index);
                                    }
                                }}>
                                    <option value={"body"} style={{
                                        backgroundColor: "gray"
                                    }}>Body</option>
                                    <option value={"query"} style={{
                                        backgroundColor: "gray"
                                    }}>Query</option>
                                </NativeSelect>
                        </Stack>

                    ))}
                    <IconButton aria-label="Add" size="sm" variant="plain" color="neutral"
                                onClick={()=>{
                                    setValues([...values, {
                                        name:'',
                                        type:'text',
                                        value: '',
                                        place: 'query'
                                    }])
                                }}>
                        <Add />Add</IconButton>
                </Stack>
                <Stack>
                    <h4>Mapping</h4>

                    <Stack direction={"row"} width={"100%"} justifyContent={"space-evenly"}>
                        <Box>Name</Box>
                        <Box>Mapping</Box>
                    </Stack>


                    {mappings.map((mapping, index) => (
                        <Stack key={'map' + index} direction={"row"}>
                            <input name="name" type="text" style={{
                                width: "50%",
                                color: "#edffff"
                            }}
                                   value={mapping.name} placeholder={"Name"}
                                   onChange={(e)=>{
                                       if (e && e.target) {
                                           mapping.name = e.target.value;
                                           updateMapping(mapping, index);
                                       }
                                   }}
                            />
                            <NativeSelect name="mapping"  style={{
                                width: "50%",
                                color: "#edffff"
                            }}
                                          value={mapping.mapping}
                                  onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>{
                                      if (e && e.target) {
                                          mapping.mapping = e.target.value as ConnectorMappingType;
                                          updateMapping(mapping, index);
                                      }
                                  }}>
                                <option value={"lat"} style={{
                                    backgroundColor: "gray"
                                }}>lat</option>
                                <option value={"lng"} style={{
                                    backgroundColor: "gray"
                                }}>lng</option>
                                <option value={"name"} style={{
                                    backgroundColor: "gray"
                                }}>name</option>
                                <option value={"height"} style={{
                                    backgroundColor: "gray"
                                }}>height</option>
                                <option value={"color"} style={{
                                    backgroundColor: "gray"
                                }}>color</option>
                                <option value={"size"} style={{
                                    backgroundColor: "gray"
                                }}>size</option>
                                <option value={"description"} style={{
                                    backgroundColor: "gray"
                                }}>description</option>
                            </NativeSelect>
                        </Stack>
                    ))}
                    <IconButton aria-label="Add" size="sm" variant="plain" color="neutral"
                                onClick={()=>{
                                    setMappings([...mappings, {
                                        name:'',
                                        mapping:'description'
                                    }])
                                }}>
                        <Add />Add</IconButton>
                    <IconButton aria-label="Query" size="sm" variant="plain" color="neutral"
                                onClick={()=>queryData()}>
                        <SendIcon />Query Data</IconButton>
                </Stack>
            </Stack>
        </GUIBox>
    )
}
