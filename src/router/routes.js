import About from '../pages/About.jsx'
import Posts from '../pages/Posts.jsx'
import PostIdPage from '../pages/PostIdPage.jsx'
import Error from '../pages/Error.jsx'
import Login from '../pages/Login.jsx'
import { Navigate } from 'react-router-dom'

export const privateRoutes = [
    { path: '/', element: About },
    { path: '/posts', element: Posts },
    { path: '/posts/:id', element: PostIdPage },
    { path: '/*', element: Error },
]

export const publicRoutes = [{ path: '/*', element: Login }]
