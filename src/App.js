import Home from './pages/home'
import Login from './pages/login'
import Register from './pages/register'
import Upload from './pages/upload'
import ChangePassword from './pages/changePassword'
import ForgotPassword from './pages/forgotPassword'
import {Route, Routes, Navigate, HashRouter} from 'react-router-dom'

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path={"/"} element={<Navigate to="/login"/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/home"} element={<Home/>}/>
                <Route path={"/register"} element={<Register/>}/>
                <Route path={"/upload"} element={<Upload/>}/>
                <Route path={"/changePassword"} element={<ChangePassword/>}/>
                <Route path={"/forgotPassword"} element={<ForgotPassword/>}/>
            </Routes>
        </HashRouter>
    )
}

export default App