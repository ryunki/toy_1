import { useState, useEffect } from 'react';

import {useSelector, useDispatch} from 'react-redux'
import {fetchPlayers} from '../redux/playerSlice'
import store from '../redux/store'

import { Card, Col, Row } from 'react-bootstrap';
import { loadState, saveState } from '../localStorage';

const Home = () => {
  const [players, setPlayers] = useState([]);
  const [match, setMatch] = useState(Boolean);
  const playersRedux = useSelector(state=>state.players)
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(fetchPlayers())
  }, []);

  useEffect(()=>{ //save data into localStorage when data arrives in redux state
    const playersFromLocal = loadState("players")
    if(playersFromLocal && playersFromLocal.players.length !== 0){  // if data already exists in local
      const loadingR = playersRedux.loading
      const playersR = playersRedux.players
      if(!loadingR && playersR.length!==0){ // check if new data arrived in redux, if arrived
        playersR.map((item,idx)=>{
          const localName = playersFromLocal?.players[idx]?.name
          const localImage = playersFromLocal?.players[idx]?.image
          if(localName === item.name && localImage === item.image){
            console.log(idx+ 'th item matches')
            setMatch((prev)=>(prev=true))
          }else{ // if there is any changes in player's name and image
            console.log('found some changes')
            setMatch((prev)=>(prev=false))
            return 
          } 
        })
        if(!match){
          console.log("update players")
          saveState(store.getState().players, "players") 
          setPlayers(playersRedux)
        }else{
          console.log("all matches")
          setPlayers(playersFromLocal) 
        }
      }else{ //if new data hasn't arrived in redux, show data from LocalStorage
        console.log("new data hasn't arrived")
        setPlayers(playersFromLocal) 
      }
    }else{
      console.log("data doesnt exist in Local")
      saveState(store.getState().players, "players") 
      setPlayers(playersRedux)
    }
  },[playersRedux])

  return (
    <>
    <h1>Hey</h1>
      <Row>
        {players.loading && <div>Loading...</div>}
        {!players.loading && players.error ? <div>Error: {players.error}</div> : null}
        { !players.loading && players.players?.length !== 0 ?
          players.players?.map((item, idx) => (
            <Col key={idx}>
              <Card style={{ width: '20rem' }}>
                <Card.Img variant="top" src={item.image} alt="player"
                ></Card.Img>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.country}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
          : null
        }
      </Row>
    </>
  );
};

export default Home;
