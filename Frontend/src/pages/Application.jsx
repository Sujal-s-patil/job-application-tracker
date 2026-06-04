function Application({ p }) {
    return (
        
        <li key={p.id}>
            <p>{p.title}</p>
            <p>{p.roleApplied} </p>
            <p>{p.jobDescription}</p>
        </li>
    )
}

export default Application