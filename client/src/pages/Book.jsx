import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function Book() {
    const [book, setBook] = useState('')

    const location = useLocation()

    const id = location.pathname.split('/')[2]

    useEffect(() => {
        fetch(`http://localhost:8080/allBooks/${id}`)
            .then(data => data.json())
            .then(json => setBook(json.book))
    }, [])

    async function dowlandBook() {
        const response = await fetch(`http://localhost:8080/${book.file}`);
        const blob = await response.blob();

        // Создаем URL для Blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Создаем временный элемент <a> для скачивания
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = book.name; // Устанавливаем имя файла для скачивания
        document.body.appendChild(link);
        link.click(); // Программно кликаем по ссылке для скачивания файла
        document.body.removeChild(link); // Удаляем элемент из DOM
        window.URL.revokeObjectURL(blobUrl); // Освобождаем URL
    }

    return (
        <>
            <div className="main_center">
                <h1>{book.name}</h1>
                <p>{book.author}</p>
                <div className="">
                    <img src={`http://localhost:8080/${book.image}`} alt="" />
                </div>
                <p>{book.text}</p>
                <button onClick={() => dowlandBook()}>Скачать</button>
            </div>
        </>
    )
}