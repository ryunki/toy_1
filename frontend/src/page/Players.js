import { useState, useEffect } from 'react';

import axios from 'axios';

import {Card, Col, Row} from 'react-bootstrap';

const getPlayers = async () => {
  const { data } = await axios.get('/api/pgatour/players');
  return data;
};

const Players = () => {
  const [players, setPlayers] = useState([]);

useEffect(()=>{
  getPlayers()
      .then((res) => {
        setPlayers(res);
        console.log(res);
      })
      .catch((err) => console.log(err));
},[])

  return (
    <>
      <h2>Players</h2>
      <Row xs={1} md={5} className="g-4">
        {players.map((item, idx) => (
          <Col key={idx}>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={item.image} alt="player"></Card.Img>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.country}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Players;
