import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Booklist() {
    const [books, setBooks] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:8080/allBooks')
            .then(data => data.json())
            .then(json => setBooks(json.books))
    }, [])


    return (
        <>
        <div className="main_center">
            <h1>Все книги</h1>
            <div className="grid">
                {
                    books?.map(book => (
                        <div className="main_content" key={book.id} onClick={() => navigate(`books/${book.id}/`)}>
                            <div className="image">
                                <img src={`http://localhost:8080/${book.image}`} alt="" />
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