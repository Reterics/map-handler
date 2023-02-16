import JSZip from "jszip";

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function binaryToBase64(binary: Uint8Array) {
    const base64Data = btoa(String.fromCharCode.apply(null, binary as unknown as number[])); // Convert binary data to base64-encoded string
}

export function ArrayBufferToBase64(arrayBuffer:ArrayBuffer) {
    let bytes = new Uint8Array(arrayBuffer),
        i,
        len = bytes.length,
        base64 = '';

    for (i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }

    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }

    return base64;
}

export function mergeGltfAndBinContent(gltfData:string, binData:ArrayBuffer): ArrayBuffer {
    const json = JSON.parse(gltfData);
    const buffers = json.buffers || [];

    const binBase64 = ArrayBufferToBase64(binData);

    buffers.push({
        byteLength: binData.byteLength,
        uri: "data:application/octet-stream;base64," + binBase64
        // uri: "data:application/octet-stream;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(binData)))
    });
    const jsonStr = JSON.stringify(json);
    const headerLength = 12;
    const jsonLength = jsonStr.length;
    const binLength = binData.byteLength;
    const glbLength = headerLength + jsonLength + binLength;
    const glbData = new ArrayBuffer(glbLength);
    const headerView = new DataView(glbData, 0, headerLength);
    headerView.setUint32(0, 0x46546C67, true); // Magic number (glTF)
    headerView.setUint32(4, 2, true); // Version
    headerView.setUint32(8, glbLength - headerLength, true); // Length
    const jsonView = new Uint8Array(glbData, headerLength, jsonLength);
    for (let i = 0; i < jsonLength; i++) {
        jsonView[i] = jsonStr.charCodeAt(i);
    }
    const binView = new Uint8Array(glbData, headerLength + jsonLength, binLength);
    binView.set(new Uint8Array(binData));
    return glbData;
}

function saveGlbFile(glbData: Uint8Array | ArrayBuffer) {
    const blob = new Blob([glbData], { type: "model/gltf-binary" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "model.glb";
    link.click();
    URL.revokeObjectURL(url);
}

// Example function to convert KMZ to KML
export function convertKMZtoKML(kmzFile: string | Uint8Array | number[] | ArrayBuffer | Blob | NodeJS.ReadableStream | Promise<string | Uint8Array | number[] | ArrayBuffer | Blob | NodeJS.ReadableStream>): Promise<string> {
    return new Promise(resolve => {
        const zip = new JSZip();

        // Load the KMZ file as a zip file
        zip.loadAsync(kmzFile).then(function() {
            // Get the KML file from the zip file
            const kmlFile = zip.file(/.*\.kml$/i)[0];
            // Read the contents of the KML file
            kmlFile.async("string").then(function(kmlString) {
                // Do something with the KML file
                resolve(kmlString);
            })
        });
    });
}
