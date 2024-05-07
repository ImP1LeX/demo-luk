import { useState } from "react"
import { useDispatch } from "react-redux"
import { authThunk } from "../redux/authSlice.js"
import { Link } from "react-router-dom"

export default function Auth() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    return (
        <>
            <h1>Вход</h1>
            <div className="div_center">
                <input  type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="никнейм" required />
                <input  type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="пароль" required />
                <p>Еще нет аккаунта? <Link to={'/reg'}>Зарегистрироваться</Link></p>
                <button onClick={() => {
                    dispatch(authThunk({
                        username,
                        password
                    }))
                }}>Войти</button>
            </div>
        </>
    )
}