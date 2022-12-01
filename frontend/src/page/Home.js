import {useState, useEffect} from 'react'

import axios from 'axios';

const getPlayers = async()=>{
  const data =  await axios.get("/api/players")
  return data
}

const Home = () => {
  const [show, setShow] = useState([])

  useEffect(()=>{
    getPlayers()
      .then(res=>setShow(res.data))
      .catch(err=>console.log(err))
  },[])

  return (
    <>
      <button >PGA Tour</button>
      {show.map((item, idx)=>(
        <div key={idx}>
          <div>{item.name}</div>
          <div>{item.country}</div>
          <div>{item.image}</div>
        </div>
      )) }
    </>
  )
};

export default Home;
