import React, { useState } from 'react';

export interface UploadedFile {
    name: string
    type: string
    size: number
    content: ArrayBuffer|string|null|undefined
}

export function FileUploadHTML(props: {onUpload:Function}) {
    const [fileList, setFileList] = useState<UploadedFile[]>([]);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        console.log(e.dataTransfer.files);

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (content) {
                let type = file.type.replace('.','');
                if (!type) {
                    type = file.name.split('.').pop() || '';
                }
                setFileList(oldArray => [...oldArray, {
                    name: file.name, type: type, size: file.size, content: content
                }]);

            }
        };
        reader.readAsArrayBuffer(file);
        //reader.readAsText(file);
    };

    const handleDragOver = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    };


    function uploadCurrentState(e: React.MouseEvent<HTMLInputElement>) {
        if (typeof props.onUpload === "function") {
            console.log('Sent files to view');
            props.onUpload(fileList, e, ()=>{setFileList([])});
        }
    }

    function resetCurrentState(e: React.MouseEvent<HTMLInputElement>) {
        setFileList([]);
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ border: '1px dashed black', padding: 10 }}
        >
            {fileList.length ? (
                <div>
                    <input type={"button"} value={'Upload'} onClick={(e)=>uploadCurrentState(e)}/>
                    <input type={"button"} value={'Reset'} onClick={(e)=>resetCurrentState(e)}/>
                </div>
            ) : ''}
            {fileList.length ? fileList.map((file, index)=>( <div key={index}>
                    <p>File name: {file ? file.name : '?'}</p>
                    <p>File type: {file ? file.type : '?'}</p>
                    <p>File size: {file ? file.size : '?'} bytes</p>
                </div>))
                : (
                <p>Drag and drop a file here</p>
            )}
        </div>
    );
}
