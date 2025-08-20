const UpdtCard = (
    title: string,
    content: string,
    complete: boolean
) => {
    return (
        <div className="">
            <h3>{title}</h3>
            <p>{content}</p>
            <p>Status: {complete ? "Complete" : "In Progress"}</p>
        </div>
    )
}

export default UpdtCard;