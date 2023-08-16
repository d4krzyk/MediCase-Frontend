import { axiosClient } from "../axiosClient"

export interface LanguageData {
    langId: number,
    langValue: string
}

export function getLanguages(moderator: boolean = false) {
    return axiosClient.get(`/${moderator ? 'Moderator' : 'Main'}/Entity/EntityLanguages/getLanguages`).then((result) => result.data as LanguageData[])
}

export function postLanguage(langCode: string) {
    return axiosClient.post(
        '/Moderator/Entity/EntityLanguages/addLanguage',
        null,
        {params: {langCode}}
    )
}

export function deleteLanguage(langId: number) {
    return axiosClient.delete(
        '/Moderator/Entity/EntityLanguages/deleteLanguage',
        { params: { langId } }
    )
}

// Nie ma czegoś takiego !!!
export function updateLanguage(language: LanguageData) {
    return axiosClient.post(
        '/Moderator/Entity/EntityLanguages/updateLanguage',
        language,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    )
}

