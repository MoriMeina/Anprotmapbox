import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import {Route, Routes, Navigate, HashRouter} from 'react-router-dom'

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path={"/"} element={<Navigate to="/login"/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/home"} element={<Home/>}/>
                <Route path={"register"} element={<Register/>}/>
            </Routes>
        </HashRouter>
    )
}

export default App