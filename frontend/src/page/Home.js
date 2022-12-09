import { useState, useEffect } from 'react';

import {useSelector, useDispatch} from 'react-redux'
import {fetchPlayers} from '../redux/playerSlice'
import store from '../redux/store'
import axios from 'axios';

import { Card, Col, Row } from 'react-bootstrap';
import { loadState, saveState } from '../localStorage';



const Home = () => {
  const [players, setPlayers] = useState([]);
  const playersRedux = useSelector(state=>state.players)
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(fetchPlayers())
    // console.log(playersRedux)
  }, []);

  useEffect(()=>{ //save data into localStorage when data arrives in redux state
    // store.subscribe(()=>{
      saveState(store.getState().players, "players") 
    // })
    const players2 = loadState("players")
    setPlayers(players2)
    // console.log("from state: ",players2)
    // console.log("store state: ",store.getState().players)
  },[playersRedux])

  return (
    <>
      <Row>
        {players.loading && <div>Loading...</div>}
        {!players.loading && players.error ? <div>Error: {players.error}</div> : null}
        { !players.loading && players.players?.length !== 0 ?
          players.players?.map((item, idx) => (
            <Col key={idx}>
              <Card style={{ width: '20rem' }}>
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt="player"
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
