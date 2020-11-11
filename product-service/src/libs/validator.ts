const PNG_OR_JPG_REGEX = /^[a-zA-Z0-9]{3,}\.(jpg|png)$/i;
const GUID_REGEX = /^[0-9A-Fa-f\-]{36}$/;

const isImageFileName = (n: string) => PNG_OR_JPG_REGEX.test(n);
const hasProperty = <T>(obj: T, name: string) => obj.hasOwnProperty(name);
const isGuid = (v: string) => GUID_REGEX.test(v);

export const validator = {
    isImageFileName,
    isGuid,
    hasProperty
};