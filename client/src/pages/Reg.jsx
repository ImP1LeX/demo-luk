import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { regThunk } from "../redux/regSlice.js"

export default function Reg() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClick = () => {
        dispatch(regThunk({
            username,
            password
        }));
        navigate('/')
    }

    return (
        <>
            <h1>Регистрация</h1>
            <div className="div_center">
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="никнейм" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="пароль" required />
                <p>Уже есть аккаунт? <Link to={'/'}>Авторизоваться</Link></p>
                <button onClick={handleClick}>Зарегистрироваться</button>
            </div >
        </>
    )
}