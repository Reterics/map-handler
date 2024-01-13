import {Box} from "@mui/joy";
import React, {CSSProperties} from "react";


export default function GUIBox({
    children,
    title,
    sx
}: {
    children: React.ReactNode
    title?: string
    sx?: CSSProperties
}) {

    const styleExtension = sx || {};

    return (
        <Box sx={(theme) => (Object.assign({
            width: "auto",
            left: 10,
            bottom: 40,
            position: "fixed",
            textAlign: "start",
            backgroundColor: 'rgba(38, 38, 38, 0.95)',
            color: "#edffff",
            boxShadow: 'sm',
            overflow: 'auto',
            border: `1px solid ${theme.vars.palette.divider}`,

        }, styleExtension))}>
            <Box className="title" sx={{
                backgroundColor: "rgba(84, 84, 84, 1)",
                borderRadius: 0,
                padding: "4px 5px",
                display: title ? "block" : "none"
            }}>
                {title}
            </Box>
            <Box sx={{
                padding: "4px 5px",
            }}>
                {children}
            </Box>
        </Box>
    )
}