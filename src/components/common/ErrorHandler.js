export function ErrorHandler({ error }) {
    return <div className='m-2 rounded-4 p-3 bg-white text-dark'>Error: {error.message}</div>;
}
