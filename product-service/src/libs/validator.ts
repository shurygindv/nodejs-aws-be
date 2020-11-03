const PNG_OR_JPG_FILE_NAME = /^[a-zA-Z0-9]{3,}\.(jpg|png)$/i;

const isImageFileName = (n: string) => PNG_OR_JPG_FILE_NAME.test(n);
const hasProperty = <T>(obj: T, name: string) => obj.hasOwnProperty(name);

export const validator = {
    isImageFileName,
    hasProperty
};