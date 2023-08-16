import { baseServerUrl } from "../../network/axiosClient"


export function RemoteImage({ filePath, className = '', style = {}, moderator = false }) {
    if (filePath === undefined) return <></>
    return (
        <img alt='' className={`rounded-4 w-100  ${className}`} style={{ objectFit: 'scale-down', ...style, }}
            src={`${baseServerUrl}/${moderator? 'Moderator':'Main'}/EntityTranslationFiles/getEntityTranslationFile?fileIdentifier=${filePath}`}
        />
    )
}
