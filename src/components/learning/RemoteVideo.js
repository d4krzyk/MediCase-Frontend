import { baseServerUrl } from "../../network/axiosClient"


export function RemoteVideo({ filePath, moderator }) {
    if (filePath === undefined) return <></>
    return (
        <video preload="metadata" controls className="w-100 rounded-4 mx-3 mt-2" style={{objectFit:'scale-down',height: "50vh"}} type="video/mp4"
            src={`${baseServerUrl}/${moderator? 'Moderator':'Main'}/EntityTranslationFiles/getEntityTranslationFile?fileIdentifier=${filePath}`} />
    )
}