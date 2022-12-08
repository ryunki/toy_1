import { useState, useEffect, useMemo } from 'react';

import axios from 'axios';

import { Button,Spinner,Card, Col, Row, DropdownButton, Dropdown } from 'react-bootstrap';


const getPlayers = async () => {
  const { data } = await axios.get('/api/pgatour/players');
  return data;
};
const getPlayerDetail = async(player)=>{
  const {data} = await axios.get('/api/pgatour/player/'+player)
  return data
}

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [showPlayer, setShowPlayer] = useState();
  const [detail, setDetail] = useState({});
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    getPlayers()
      .then((res) => {
        setPlayers(res);
        setShowPlayer(res[0])
        setSelectedPlayer(res[0].name)
      })
      .catch((err) => console.log(err));
  }, []);

  const showPlayerHandler = (player) => {
    isLoading(true)
    setSelectedPlayer(player);
    players.map((item, idx) => {
      if (player === item.name) {
        setShowPlayer(item);
      }
    });
  };
  // console.log(selectedPlayer)
  useEffect(()=>{
    getPlayerDetail(selectedPlayer)
      .then((res)=>{
        isLoading(false)
        setDetail(res)
      })
      .catch((err)=>{
        console.log(err)
      })
  },[selectedPlayer, players])

  return (
    <>
      <Card.Title style={{fontSize:30}}>Players</Card.Title>
      <br/>
      <Row md={4} >
        <Col>
          <DropdownButton id="dropdown-basic-button" title={selectedPlayer|| "select"}>
        {players &&
             players.map((item, idx) => (
              <Dropdown.Item key={idx} onClick={() => showPlayerHandler(item.name)}>
                {item.name}
              </Dropdown.Item>
            ))
          }
          </DropdownButton>
        </Col>

        <Col>
        {showPlayer &&
          <Card style={{ width: 'auto' }}>
            <Card.Img variant="top" src={showPlayer.image} alt="player"></Card.Img>
            <Card.Body>
              <Card.Title>{showPlayer.name}</Card.Title>
              <Card.Text>{showPlayer.country}</Card.Text>
            </Card.Body>
          </Card>
          // : players &&
          // <Card style={{ width: 'auto' }}>
          //       <Card.Img
          //         variant="top"
          //         src={players[0].image}
          //         alt="player"
          //       ></Card.Img>
          //       <Card.Body>
          //         <Card.Title>{players[0].name}</Card.Title>
          //         <Card.Text>{players[0].country}</Card.Text>
          //       </Card.Body>
          //     </Card>
        }
        </Col>
        <Col>
          {loading ? 
            <Button style={{height:"auto"}}variant="primary" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            &nbsp;&nbsp; Loading...
          </Button>
          : detail && 
            <Card>
              <Card.Body>
                <Card.Title>{detail.fullname}</Card.Title>
                <Card.Text>
                    <a href={detail.link}>
                      {detail.link}
                    </a>
                </Card.Text>
              </Card.Body>
              
            </Card>
          }
        </Col>
      </Row>
    </>
  );
};

export default Players;
