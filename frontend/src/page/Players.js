import { useState, useEffect } from 'react';

import axios from 'axios';

import { Card, Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';

const showPlayer = {};

const getPlayers = async () => {
  const { data } = await axios.get('/api/pgatour/players');
  return data;
};

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [showPlayer, setShowPlayer] = useState();

  useEffect(() => {
    getPlayers()
      .then((res) => {
        setPlayers(res);
      })
      .catch((err) => console.log(err));
  }, []);

  const showPlayerHandler = (player) => {
    setSelectedPlayer(player);
    players.map((item, idx) => {
      if (player === item.name) {
        setShowPlayer(item);
      }
    });
  };
  
  return (
    <>
      <Card.Title style={{fontSize:30}}>Players</Card.Title>
      <br/>
      <Row xs={1} md={5} className="g-4">
        <Col>
          <DropdownButton id="dropdown-basic-button" title={selectedPlayer||"Select"}>
            {players.map((item, idx) => (
              <Dropdown.Item key={idx} onClick={() => showPlayerHandler(item.name)}>
                {item.name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Col>

        <Col>
        {showPlayer && 
          <Card style={{ width: '20rem' }}>
            <Card.Img variant="top" src={showPlayer.image} alt="player"></Card.Img>
            <Card.Body>
              <Card.Title>{showPlayer.name}</Card.Title>
              <Card.Text>{showPlayer.country}</Card.Text>
            </Card.Body>
          </Card>
        }

          {/* {players.map((item, idx) => (
              <Card key={idx} style={{ width: '20rem'}}>
                <Card.Img variant="top" src={item.image} alt="player"></Card.Img>
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text>{item.country}</Card.Text>
                </Card.Body>
              </Card>
          ))} */}
        </Col>
      </Row>
    </>
  );
};

export default Players;
