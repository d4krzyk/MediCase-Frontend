import { axiosClient } from "../axiosClient";

interface PostTranslation{
    entityId: number,
    langId: number,
    mainTitle: string,
    subTitle: string,
    paragrahps: string,
}

interface UpdateTranslation{
    translationId: number
    langId: number,
    mainTitle: string,
    subTitle: string,
    paragrahps: string
}

export function postTranslation(translation: PostTranslation) {
    return axiosClient.post(
        '/Moderator/EntityTranslations/addEntityTranslation',
        translation,
        { headers: { 'Content-Type': 'application/json' } }
    )
}

export function deleteTranslation(translationId: number) {
    return axiosClient.delete(
        '/Moderator/EntityTranslation/deleteEntityTranslation',
        { params: { translationId } }
    )
}

export function updateTranslation(translation: UpdateTranslation){
    return axiosClient.patch(
        'Moderator/EntityTranslations/updateEntityTranslation',
        translation,
        { headers: { 'Content-Type': 'application/json' } }
    )
}