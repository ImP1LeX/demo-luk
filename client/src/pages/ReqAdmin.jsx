import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function ReqAdmin() {
    const [books, setBooks] = useState([])

    const token = useSelector((state) => state.auth.token)
    console.log(token);

    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:8080/req', {
            method: 'GET',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then(data => data.json())
            .then(json => setBooks(json.requests))
    }, [])

    const sendStatus = (id, statusId) => {
        fetch(`http://localhost:8080/status`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, statusId })
        })
            .then(data => data.json())
            .then(json => {
                setBooks(prevBooks => prevBooks.filter(book => book.id !== json.update[0].id));
            })
    }

    return (
        <>
        <div className="main_center">
            <h1>Заявки</h1>
            <div className="grid">
                {
                    books?.map(book => (
                        <div className="main_content" key={book.id} >
                            <img src={`http://localhost:8080/${book.image}`} onClick={() => navigate(`/books/${book.id}/`)} alt="" />
                            <h3>{book.name}</h3>
                            <p>{book.author}</p>
                            <div className="">
                                <button onClick={() => sendStatus(book.id, 'Принят')}>Принять</button>
                                <button onClick={() => sendStatus(book.id, 'Отклонен')}>Отклонить</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        </>
    )
}