
import './App.css'
import Sidebar from "./components/sidebar";
import { User } from 'lucide-react';


function App() {

  return (
    <>
      <Sidebar user="John Doe" profilePicture={<User />} />
    </>
  )
}

export default App
