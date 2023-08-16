import { Spinner } from "react-bootstrap"


export function LoadingSpinner({className}){
    return (
        <Spinner animation="grow" role="status" className={`m-4 text-center text-secondary ${className}`}/>
    )
}