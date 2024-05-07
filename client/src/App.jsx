import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Auth from './pages/Auth'
import Reg from './pages/Reg'
import Header from './components/Header'
import Booklist from './pages/Booklist'
import Book from './pages/Book'
import Newbook from './pages/Newbook'
import Mybooks from './pages/Mybooks'
import ReqAdmin from './pages/ReqAdmin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Auth />
  },
  {
    path: '/reg',
    element: <Reg />
  },
  {
    path: '*',
    element: <Navigate to={'/'} />
  },
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      {
        path: '/',
        element: <Booklist />
      },
      {
        path: 'books/:id/',
        element: <Book />
      },
      {
        path: 'books/newbook/',
        element: <Newbook />
      },
      {
        path: 'books/mybooks/',
        element: <Mybooks />
      },
      {
        path: '*',
        element: <Navigate to={'/'} />
      },

    ]
  },
])

const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      {
        path: '/',
        element: <Booklist />
      },
      {
        path: 'books/:id/',
        element: <Book />
      },
      {
        path: 'books/req/',
        element: <ReqAdmin />
      },
      {
        path: '*',
        element: <Navigate to={'/'} />
      },
    ]
  }
])

function App() {
  const token = useSelector((state) => state.auth.token)
  const roleid = useSelector((state) => state.auth.roleid)

  return (
    token ?
      roleid == "USER" ? <RouterProvider router={userRouter} />
        : <RouterProvider router={adminRouter} />
      : <RouterProvider router={router} />
  )
}

export default App