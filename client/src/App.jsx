import { useState } from 'react'
import MovieCard from "./components/MovieCard"
import Discover from "./pages/Discover"
import Home from "./pages/Home"
import { Routes, Route } from 'react-router-dom'


function App() {
  return (
    <main className='main-content'>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/discover" element={<Discover />}></Route>
      </Routes>
    </main>
  )
}

export default App
