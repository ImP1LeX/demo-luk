import { useDispatch, useSelector } from "react-redux"
import { logout } from "../redux/authSlice"
import { Link } from "react-router-dom"
import { useEffect } from "react"

export default function Header() {
    const dispatch = useDispatch()
    const roleid = useSelector((state) => state.auth.roleid)

    useEffect(()=>{
        console.log(roleid)
    },[roleid])

    return (
        <div className="header_bg">
            <div className="header">
                <Link to={'/'}>Главная</Link>
                {
                    roleid == "ADMIN" ?
                        <Link to={'books/req/'}>Запросы</Link>
                        :
                        <>
                            <Link to={'books/newbook/'}>Новая книга</Link>
                            <Link to={'books/mybooks/'}>Мои книги</Link>
                        </>
                }
                <button onClick={() => {
                    dispatch(logout())
                }}>Выйти</button>
            </div>
        </div>
    )
}