import React, { useState, useEffect } from 'react';

import axios from 'axios';

import {
  Table,
  Spinner,
  Button,
  Card,
  Container,
  Row,
  Col,
} from 'react-bootstrap';

const getLeaderBoard = async () => {
  const { data } = await axios.get('/api/pgatour/leaderboard');
  console.log('data:::: ', data);
  return data;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [tableHeader, setTableHeader] = useState({});
  const [tournamentInfo, setTournamentInfo] = useState({});
  const [videos, setVideos] = useState([]);
  const [rounds, setRounds] = useState(0);
  const [loading, isLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLeaderBoard()
      .then((res) => {
        setLeaderboard(res.leaderboard);
        setTournamentInfo(res.tournament_info);
        setVideos(res.tournament_info.videos);
        setTableHeader(res.table_header);
        isLoading(false);
        // console.log(res.leaderboard.score_board.strokes)
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col xl={4}>
          <Card
            bg="dark"
            text="white"
            style={{height:"11vh"}}
            className="mb-2"
          >
            <Card.Header>TOURNAMENT INFO</Card.Header>
            {loading ? 
                <Button style={{height:"100%"}}variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  &nbsp;&nbsp; Loading...
                </Button>
              :
              tournamentInfo && (
              <>
                <Card.Title className="mx-auto">{tournamentInfo.name}</Card.Title>
                <Card.Text className="mx-auto">{tournamentInfo.date}</Card.Text>
              </>
            )}
          </Card>
          <Card bg="dark"
            text="white"
            >
            <Card.Header >VIDEOS</Card.Header>
            {videos[0] !== null ? (
              videos.map((item, idx) => (
                <div key={idx}>
                  <div>{item.title}</div>
                  <div>{item.desc}</div>
                  <div>{item.link}</div>
                </div>
              ))
            ) : (
              <>
                <Card.Text className="mx-auto">No Videos</Card.Text>
                <br/>
              </>
              
            )}
          </Card>
        </Col>
        <Col xl={8}>
          <Card
            bg="dark"
            text="white"
            style={{ width: 'auto' }}
            className="mb-2"
          >
            <Card.Header>LEADERBOARD</Card.Header>
            {loading ? (
              <>
                <Button variant="primary" disabled>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  &nbsp;&nbsp; Loading... (may take few seconds)
                </Button>
              </>
            ) : error ? (
              <Card.Text className="mx-auto">
                Error while loading leaderboard. Please refresh the page.
              </Card.Text>
            ) : (
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    {tableHeader && (
                      <>
                        <th>{tableHeader.position}</th>
                        <th>{tableHeader.country}</th>
                        <th>{tableHeader.player}</th>
                        <th>{tableHeader.total}</th>
                        {tableHeader.all_rounds &&
                          tableHeader.all_rounds.map((r, idx) => (
                            <th key={idx}>{r}</th>
                          ))}
                        <th>{tableHeader.strokes}</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length !== 0 ? (
                    leaderboard.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.position}</td>
                        <td>{item.country}</td>
                        <td>{item.player}</td>
                        <td>{item.score_board.total}</td>
                        {item.score_board.rounds.map((round, idx2) => (
                          <td key={idx2}>{round}</td>
                        ))}
                        <td>{item.score_board.strokes}</td>
                      </tr>
                    ))
                  ) : (
                    
                    // <tr>Could not find Leaderboard. Please refresh the page.</tr>
                    <tr>
                      <td/>
                      <td/>
                      <td>
                        <Card.Text className="mx-auto">Could not find Leaderboard. Please refresh the page.</Card.Text>
                      </td>
                      <td/>
                      <td/>
                    </tr>
                    )}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Leaderboard;
