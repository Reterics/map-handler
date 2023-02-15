import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import {formDataToJSON} from "../../commons/frontend";
import {useRef} from "react";

export default function NewEntityModal(options:{open:boolean, setOpen:Function, onSubmit:Function}) {
    const form = useRef<HTMLFormElement>(null);
    return (

        <Modal open={options.open} onClose={() => options.setOpen(false)}>
            <ModalDialog
                aria-labelledby="basic-modal-dialog-title"
                aria-describedby="basic-modal-dialog-description"
                sx={{ maxWidth: 500 }}
            >
                <Typography id="basic-modal-dialog-title" component="h2">
                    Add new Layer/Entity
                </Typography>
                <Typography id="basic-modal-dialog-description" textColor="text.tertiary">
                    Please give me information about your Entity
                </Typography>
                <form ref={form}
                    onSubmit={(event) => {
                        event.preventDefault();
                        if (typeof options.onSubmit === "function" && form.current) {
                            options.onSubmit(formDataToJSON(form.current));
                        }
                        options.setOpen(false);
                        return false;
                    }}
                    style={{display:"flex"}}
                >
                    <Stack spacing={2} style={{marginRight: '10px'}}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input autoFocus required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Input required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Latitude</FormLabel>
                            <Input name="latitude" required placeholder="Latitude" />
                        </FormControl>
                    </Stack>
                    <Stack spacing={2} style={{marginRight: '10px'}}>
                        <FormControl>
                            <FormLabel>Color</FormLabel>
                            <Input name="color" required type={"color"}/>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Size</FormLabel>
                            <Input name="size" required type="number" value={10}/>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Longitude</FormLabel>
                            <Input name="longitude" required placeholder="Longitude"/>
                        </FormControl>
                        <Button type="submit">Submit</Button>
                    </Stack>
                </form>
            </ModalDialog>
            </Modal>
    );
}
