import { useState } from "react";
import Navbar from "./Components/Navbar";
import NewsBoard from "./Components/NewsBoard";
function App() {
  const [category ,setCategory] = useState("technology");
  return (
    <>
   
      <Navbar setCategory={setCategory} />
      <NewsBoard category = {category}/>
    </>
  );
}

export default App;
