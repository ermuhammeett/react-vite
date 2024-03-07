import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { privateRoutes, publicRoutes } from '../router/routes.js'
import About from '../pages/About.jsx'
import Login from '../pages/Login.jsx'
import { AuthContext } from '../context/index.js'

const AppRouter = () => {
    const { isAuth } = useContext(AuthContext)
    return isAuth ? (
        <Routes>
            {privateRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.element />}
                />
            ))}
            <Route path={'/*'} element={<Navigate to={Login} replace />} />
        </Routes>
    ) : (
        <Routes>
            {publicRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.element />}
                />
            ))}
            <Route path={'/*'} element={<Navigate to={Login} replace />} />
        </Routes>
    )
    // <Routes>
    //     <Route path={'/'} element={<About />} />
    //     <Route path={'/posts'} element={<Posts />} />
    //     <Route path={'/posts/:id'} element={<PostIdPage />} />
    //     <Route path={'/error'} element={<Error />} />
    //     <Route path={'/*'} element={<Navigate to="/error" />} />
    // </Routes>
}

export default AppRouter
