import {Box, Theme} from "@mui/joy";
import React, {CSSProperties, useEffect, useRef, useState} from "react";

var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

export default function GUIBox({
    children,
    title,
    sx,
    draggable
}: {
    children: React.ReactNode
    title?: string
    sx?: CSSProperties,
    draggable?: boolean
}) {

    const element = useRef<HTMLElement>(null);
    const outerSx = (theme: Theme) => (Object.assign({
        width: "auto",
        left: 10,
        bottom: 40,
        height: 'max-content',
        position: "fixed",
        textAlign: "start",
        backgroundColor: 'rgba(38, 38, 38, 0.95)',
        color: "#edffff",
        boxShadow: 'sm',
        overflow: 'auto',
        border: `1px solid ${theme.vars.palette.divider}`,
    }, sx || {}));

    const titleSx = {
        backgroundColor: "rgba(84, 84, 84, 1)",
        borderRadius: 0,
        padding: "4px 5px",
        display: title ? "block" : "none"
    };

    const bodySx = {
        padding: "4px 5px",
    };

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function elementDrag(event: MouseEvent) {
        const e = event || window.event;

        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        const elmnt = element.current as HTMLElement;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    const onMouseDown = (event: React.MouseEvent)=> {
        if (draggable) {
            const e = event.nativeEvent || event || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    }

    return (
        <Box ref={element} sx={outerSx} onMouseDown={onMouseDown}>
            <Box className="title" sx={titleSx}>
                {title}
            </Box>
            <Box sx={bodySx}>
                {children}
            </Box>
        </Box>
    )
}