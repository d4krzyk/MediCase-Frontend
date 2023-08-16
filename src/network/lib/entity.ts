import { NodeMapper } from "../../lib/utility"
import { LanguageConfig } from "../../lib/store"
import { axiosClient } from "../axiosClient"
import { ReactElement } from "react"

interface Field {
    name: ('MainTitle' | 'qMainTitle' | 'Paragraphs' | 'testQuestion' | 'isCustom'),
    type: 'q' | 'f'
}

export interface NodeType {
    textFields: Field[]
    fileFields: ('voice' | 'image' | 'video')[],
    mapper(node: ServerNodeData, moderator?: boolean): ReactElement | undefined,
    preprocess(node: ServerNodeTranslation | undefined): any
    isChildValid: (typeId: number) => boolean
}

interface PostEntity {
    parentId: number
    typeId: number,
    entityOrder: number
}

interface PatchEntity {
    entityId: number,
    entityOrder: number
}

export interface ServerNodeTranslation {
    translationId: number,
    langId: number,
    entityId: number,
    mainTitle: string,
    subTitle: string,
    paragrahps: string,
    custom: any,
    countryCode?: string,
    files: ServerFile[]
}

interface ServerFile {
    fileId: number,
    translationId: number,
    fileType: string,
    filePath: string,
    refferedField: string,
    filePriority: number
}

export interface ServerNodeData {
    isPreview: boolean | undefined
    entityId: number,
    typeId: number,
    entityOrder: number,
    hasChilds: boolean,
    isLocked: boolean,
    entityTranslations: (ServerNodeTranslation | undefined)[],
    childs: ServerNodeData[]
}

function organizeTranslations(translations: (ServerNodeTranslation | undefined)[], langIds: number[], nodeType: number): (ServerNodeTranslation | undefined)[] {
    const organized = langIds.map(langId => translations.find(translation => translation?.langId === langId))
    return organized.map(o => ({ ...o, custom: NodeMapper.get(nodeType)?.preprocess(o) } as (ServerNodeTranslation | undefined)))
}

export function organizeNode(node: ServerNodeData, langIds: number[]): ServerNodeData {
    let organized: ServerNodeData = {
        ...node,
        entityTranslations: organizeTranslations(node.entityTranslations, langIds, node.typeId),
        childs: node.childs?.map((child) => ({
            ...child,
            entityTranslations: organizeTranslations(child.entityTranslations, langIds, node.typeId)
        })).sort((a, b) => a.entityOrder - b.entityOrder)
    }
    return organized
}

export function findTranslation(node: ServerNodeData, langId: number) {
    return node.entityTranslations.find(t => t?.langId === langId)
}

export function postEntity(postEntity: PostEntity) {
    return axiosClient.post(
        `/Moderator/Entity/addEntity`,
        {},
        { params: postEntity }
    )
}

export function updateEntity(entities: PatchEntity[]) {
    return axiosClient.patch(
        '/Moderator/Entity/updateEntityOrder',
        entities,
        { headers: { 'Content-Type': 'application/json' } }
    ).then(response => { return response })
}

export function deleteEntity(entityId: number) {
    return axiosClient.delete(
        '/Moderator/Entity/deleteEntity',
        { params: { entityId } }
    )
}

export function getEntityWithTranslation(entityId: number, langIds: number[], moderator: boolean = false): Promise<ServerNodeData> {
    return axiosClient.get(
        `/${moderator ? 'Moderator' : 'Main'}/Entity/getEntityWithTranslations`,
        { params: { entityId } }
    ).then(response => organizeNode(response.data as ServerNodeData, langIds))
}

export function getEntityWithChildren(entityId: number, langIds: number[], moderator: boolean = false): Promise<ServerNodeData> {
    return axiosClient.get(
        `/${moderator ? 'Moderator' : 'Main'}/EntitiesGraphData/getEntityWithChildsByLanguage`,
        {
            params: { entityId, langIds },
            paramsSerializer: {
                indexes: null
            },
        },
    ).then(response =>
        organizeNode(response.data as ServerNodeData, langIds)
    )
}

export function getEntityWithChildrenConfig(entityId: number, config: LanguageConfig, moderator: boolean = false): Promise<ServerNodeData> {
    const langIds = [config.native, config.foreign]
    return axiosClient.get(
        `/${moderator ? 'Moderator' : 'Main'}/EntitiesGraphData/getEntityWithChildsByLanguage`,
        {
            params: { entityId, langIds },
            paramsSerializer: {
                indexes: null
            },
        },
    ).then(response =>
        {
            return organizeNode(response.data as ServerNodeData, langIds)
        }
        
    )
}

interface GenerateTranslationRequest {
    translationId: number,
    desiredLanguageId: number
}

export function generateEntityTranslation(request: GenerateTranslationRequest) {
    return axiosClient.post('/Moderator/EntityTranslations/generateEntityTranslation', null, { params: request }).then(response => response.data as ServerNodeTranslation)
}

interface GenerateEntityTranslationVoiceRequest {
    translationId: number,
    referredField: 'string'
}

export function generateEntityTranslationVoice(request: GenerateEntityTranslationVoiceRequest) {
    return axiosClient.post(`/Moderator/EntityTranslationFiles/generateEntityTranslationVoice`, null, {params: request}).then(response => response.data)
}

interface RefreshEntityLockRequest {
    entityId: number,
    seconds: number
}

export function refreshEntityLock(request: RefreshEntityLockRequest) {
    return axiosClient.patch('/Moderator/Entity/refreshEntityLock', null, { params: request })
}

