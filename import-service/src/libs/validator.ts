const PNG_OR_JPG_REGEX = /^[a-zA-Z0-9]{3,}\.(jpg|png)$/i;
const CSV_FILE_NAME_REGEX = /^[a-zA-Z0-9]+\.csv$/i;
const GUID_REGEX = /^[0-9A-Fa-f\-]{36}$/;

const isImageFileName = (n: string) => PNG_OR_JPG_REGEX.test(n);
const hasProperty = <T>(obj: T, name: string) => obj.hasOwnProperty(name);
const isGuid = (v: string) => GUID_REGEX.test(v);
const isCSVFileName = (n: string) => CSV_FILE_NAME_REGEX.test(n);

export const validator = {
    isImageFileName,
    isCSVFileName,
    hasProperty,
    isGuid,
};