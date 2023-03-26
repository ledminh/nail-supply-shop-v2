export default function createFormData(obj: any) {
    const formData = new FormData();

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            formData.append(key, obj[key].toString());
        }
    }

    return formData;
}