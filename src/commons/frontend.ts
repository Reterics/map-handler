export function formDataToJSON (json: FormData|HTMLFormElement){
    let checkboxes: NodeListOf<HTMLInputElement> = [] as unknown as NodeListOf<HTMLInputElement>;
    if (json instanceof HTMLFormElement && json.tagName && json.tagName.toLowerCase() === "form") {
        checkboxes = json.querySelectorAll('[type=checkbox]');
        json = new FormData(json);
    }
    let outputObj:any = {};
    if (json instanceof FormData){
        const formData = json;
        outputObj = {};
        for (const [key, value] of formData.entries()) {
            //console.log(key, value);
            if(key.endsWith("[]")){
                if(Array.isArray(outputObj[key])){
                    outputObj[key].push(value);
                } else {
                    outputObj[key] = [value];
                }
            } else {
                outputObj[key] = value;
            }

        }
    }
    try {
        checkboxes.forEach(checkbox=>{
            const name = checkbox.getAttribute('name');
            if (name) {
                outputObj[name] = checkbox.checked;
            }
        });
    } catch (e){
        console.error(e)
    }

    if(!json || typeof json != "object") {
        return {};
    } else {
        return json;
    }
}
