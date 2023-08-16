import * as DOMPurify from 'dompurify'

interface SanitizedProps{
    text: string | undefined,
    className: string|undefined
}

export function Sanitized({text, className=''} : SanitizedProps){
    return (
        <span className={className} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(text ?? '')}}/>
    )
}
 