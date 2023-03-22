import Home from './pages/home'
import {Route, Routes, Navigate, BrowserRouter} from 'react-router-dom'

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Navigate to="/home"/>}/>
          <Route path={"/home"} element={<Home/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App