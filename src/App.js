import Home from './pages/home'
import Register from './pages/register'
import Upload from './components/upload'
import ChangePassword from './pages/changePassword'
import ForgotPassword from './pages/forgotPassword'
import Admin from './pages/admin'
import {HashRouter, Navigate, Route, Routes} from 'react-router-dom'

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path={"/"} element={<Navigate to="/home"/>}/>
                <Route path={"/home"} element={<Home/>}/>
                <Route path={"/register"} element={<Register/>}/>
                <Route path={"/upload"} element={<Upload/>}/>
                <Route path={"/changePassword"} element={<ChangePassword/>}/>
                <Route path={"/forgotPassword"} element={<ForgotPassword/>}/>
                <Route path={"/admin"} element={<Admin/>}/>
            </Routes>
        </HashRouter>
    // 做项目不给钱的都:(，也没亏注稱，伯别人接手项目取代我的位置
    // 过年前可能我还能看懂代码，过完年我已经忘了，没人能看懂这个项目了
    // 现在我找好下家溜了，薪资double，这个项目只能交给你了
    // 我劝你也赶紧溜吧，学校根本不发钱，他们说有是骗你的
    )
}

export default App