import { useState } from "react"
import { useSelector } from "react-redux"

export default function Newbook() {
    const [name, setName] = useState('')
    const [author, setAuthor] = useState('')
    const [text, setText] = useState('')
    const [image, setImage] = useState(null)
    const [file, setFile] = useState(null)

    const id = useSelector((state) => state.auth.id)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData();

        formdata.append('name', name)
        formdata.append('author', author)
        formdata.append('text', text)
        formdata.append('image', image)
        formdata.append('file', file)
        formdata.append('userId', id)

        try {
            const response = await fetch('http://localhost:8080/newbook', {
                method: "POST",
                body: formdata
            })

            const data = await response.json()
            console.log(data);

            alert('Данные успешно отправлены на сервер')

            location.reload()
        } catch (error) {
            console.log(error);
            return
        }
    }

    return (
        <>
            <h1>Загрузите новую книгу</h1>
            <form onSubmit={handleSubmit} className="div_center">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="название" required />
                <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="автор" required />
                <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="описание" required />
                <label>
                    изображение:
                    <input type="file" accept=".jpg, .jpeg, .png" onChange={e => setImage(e.target.files[0])} placeholder="" required />
                </label>
                <label>
                    файл книги:
                    <input type="file" accept=".txt, .pdf, .doc, .docx" onChange={e => setFile(e.target.files[0])} placeholder="" required />
                </label>
                <button>Загрузить</button>
            </form>
        </>
    )
}