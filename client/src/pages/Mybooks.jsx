import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function Mybooks() {
    const [books, setBooks] = useState([])

    const id = useSelector((state) => state.auth.id)

    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://localhost:8080/myBooks/${id}`)
            .then(data => data.json())
            .then(json => setBooks(json.books))
    }, [])

    return (
        <>
        <div className="main_center">
            <h1>Ваши книги</h1>
            <div className="grid">
                {
                    books?.map(book => (
                        <div className="main_content" key={book.id} onClick={() => navigate(`/books/${book.id}/`)}>
                            <p>{book.statusid}</p>
                            <div className="image">
                                <img src={`http://localhost:8080/${book.image}`} alt="изображение" />
                            </div>
                            <h3>{book.name}</h3>
                            <p>{book.author}</p>
                        </div>
                    ))
                }
            </div>
        </div>
        </>
    )
}