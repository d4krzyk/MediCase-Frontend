import { axiosClient } from "../axiosClient";

interface PostTranslationFile{
    translationId: number,
    filePriority: number,
    file: File,
    referredField: string,
}

export function postTranslationFile(translation: PostTranslationFile) {
    return axiosClient.post(
        '/Moderator/EntityTranslationFiles/addEntityTranslationFile',
        translation,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    )
}

export function getTranslationFile(fileIdentifier: string){
    return axiosClient.get(
        '/Moderator/EntityTranslationFiles/getEntityTranslationFile',
        { params: { fileIdentifier } }
    )
}

// co wysyłamy?
// dlaczego nie query? (obecnie zrobiłem na query)
export function deleteTranslationFile(entityTranslationFileId: string){
    return axiosClient.delete(
        `/Moderator/EntityTranslationFiles/deleteEntityTranslationFile`,
        { params: { entityTranslationFileId } }
    )
}