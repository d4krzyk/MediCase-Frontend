import { Link, useNavigate } from 'react-router-dom';
import { getTypes } from '../network/lib/type';

export function ErrorPage({message = 'Error connecting to the server', linkText= 'Try again'}) {
    const navigate = useNavigate()
    getTypes().then(types => navigate('/site')).catch(e => {})

    return (
        <div style={{ backdropFilter: 'blur(5px)' }} className='container border border-left border-right border-2 border-background bg-background bg-opacity-50 d-flex flex-column h-100 justify-content-center align-items-center text-white text-center'>
            <h1>{message}</h1>
        	<Link className='btn btn-background border border-2 border-secondary rounded-pill fs-lg-2 fs-4 my-2 text-white' to={0}>
                {linkText}
            </Link>
        </div>
    );
}
