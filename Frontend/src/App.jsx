import { useState } from 'react'
import Login from "./pages/Login";
import Register from "./pages/Register";

import { Routes, Route } from "react-router-dom"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route index  element={<Login />} />
        <Route path='register' element={<Register />} />

      </Routes>

    </>
  )
}


export default App
