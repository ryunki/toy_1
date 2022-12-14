import React, { useState, useEffect } from 'react';



import {Table,Spinner,Card,Container, Row,Col} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaderboard } from '../redux/leaderboardSlice';
import store from '../redux/store'

import { loadState, saveState } from '../localStorage';

// const getLeaderBoard = async () => {
//   const { data } = await axios.get('/api/pgatour/leaderboard');
//   return data;
// };

const Leaderboard = () => {
  const dispatch = useDispatch()
  const loadingRedux = useSelector(state=> state.leaderboardState.loading)
  const errorRedux = useSelector(state=> state.leaderboardState.error)
  const leaderboardRedux = useSelector(state=> state.leaderboardState.leaderboard)
  const {leaderboard,table_header,tournament_info} = leaderboardRedux
  
  const [showLeaderboard, setShowLeaderboard] = useState([]);
  const [showTableHeader, setShowTableHeader] = useState({});
  const [showTournamentInfo, setShowTournamentInfo] = useState({});

  // const [videos, setVideos] = useState([]);

  const [refresh, setRefresh] = useState(false)
useEffect(()=>{
    dispatch(fetchLeaderboard())
  },[])
useEffect(()=>{
  // leaderboard = undefined
  const leaderboardFromLocal = loadState("leaderboardState")
  const lbFromLocal = leaderboardFromLocal?.leaderboard.leaderboard
  const thFromLocal = leaderboardFromLocal?.leaderboard.table_header
  const tiFromLocal = leaderboardFromLocal?.leaderboard.tournament_info
  if(leaderboardFromLocal && leaderboardFromLocal.leaderboard !== 0){ // if leaderboard exists in local storage
    if(!loadingRedux && leaderboard?.length !== 0){ //if leaderboard has arrvied in redux state
      console.log("***update leaderboard")
      saveState(store.getState().leaderboardState, "leaderboardState")
      setShowLeaderboard(leaderboard)
      setShowTableHeader(table_header)
      setShowTournamentInfo(tournament_info)
    } else{
      console.log("***no update")
      setShowLeaderboard(lbFromLocal)
      setShowTableHeader(thFromLocal)
      setShowTournamentInfo(tiFromLocal)
      if(leaderboard?.length ===0){
        setRefresh(true)
      }else{
        setRefresh(false)
      }
    }
  }else{
    console.log("***leaderboard from local doesnt exist")
    setShowLeaderboard(leaderboard)
    setShowTableHeader(table_header)
    setShowTournamentInfo(tournament_info)
    saveState(store.getState().leaderboardState, "leaderboardState")
  }
},[leaderboard,table_header,tournament_info,errorRedux,loadingRedux])

  return (
    <Container fluid>
      <Row>
        <Col xl={4}>
        <Card  bg="dark" text="white" style={{height:"11vh"}} className="mb-2" >
            <Card.Header>TOURNAMENT INFO</Card.Header>
            {!loadingRedux && showTournamentInfo ? (<>
              <Card.Title className="mx-auto">{showTournamentInfo.name}</Card.Title>
              <Card.Text className="mx-auto">{showTournamentInfo.date}</Card.Text>
            </>) : loadingRedux && showTournamentInfo ? (
              <>
              <Card.Title className="mx-auto">{showTournamentInfo.name}</Card.Title>
              <Card.Text className="mx-auto">{showTournamentInfo.date}</Card.Text>
            </>
            ) : null}
          </Card>
          <Card bg="dark"text="white">
          <Card.Header >VIDEOS</Card.Header>{console.log(showTournamentInfo.videos)}
            {!loadingRedux &&showTournamentInfo?.videos ? (<>
              {showTournamentInfo.videos.map((item,idx)=> 
              <div key={idx}>
                <Card.Text className="mx-auto">{item.title}</Card.Text>
                <Card.Text className="mx-auto">{item.desc}</Card.Text>
                <Card.Text className="mx-auto">{item.link}</Card.Text>
              </div>
            )}
            </>) : loadingRedux && showTournamentInfo?.videos ? (<>
              {showTournamentInfo.videos.map((item,idx)=> 
              <div key={idx}>
                <Card.Text className="mx-auto">{item.title}</Card.Text>
                <Card.Text className="mx-auto">{item.desc}</Card.Text>
                <Card.Text className="mx-auto">{item.link}</Card.Text>
              </div>
            )}
            </>) : <Card.Text className="mx-auto">No Videos</Card.Text>}
                  
          </Card>
        </Col>
        <Col xl={8}>
        <Card bg="dark" text="white" style={{ width: 'auto'}} className="mb-2">
            <Card.Header style={{ display:'flex', justifyContent: 'space-between'}}>LEADERBOARD {"  "}
              {loadingRedux ?  
                <Card.Text variant="primary" >
                <Spinner as="span" animation="border" size="sm"  role="status" aria-hidden="true" />
                &nbsp;&nbsp; Updating... 
                </Card.Text>
               : refresh && leaderboard?.length === 0 ?  
                <Card.Text variant="primary" >
                &nbsp;&nbsp; No incoming data from website. refresh the page
                </Card.Text>
                :  !leaderboard && errorRedux === "Request failed with status code 500"?    //sometimes leaderboard is undefined after retreiving data from webpage
                <Card.Text variant="primary" >
                &nbsp;&nbsp; Refresh the page
                </Card.Text>
                : !loadingRedux && leaderboard?.length !== 0 &&
                <Card.Text variant="primary" >
                &nbsp;&nbsp; Update completed
                </Card.Text>
               }
            </Card.Header> 
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                  {!loadingRedux && showTableHeader ? (
                      <>
                        <th>{showTableHeader.position}</th>
                        <th>{showTableHeader.country}</th>
                        <th>{showTableHeader.player}</th>
                        <th>{showTableHeader.total}</th>
                        {showTableHeader.all_rounds &&
                          showTableHeader.all_rounds.map((r, idx) => (
                            <th key={idx}>{r}</th>
                          ))}
                        <th>{showTableHeader.strokes}</th>
                      </>
                    ) : loadingRedux &&showTableHeader&& (
                      <>
                        <th>{showTableHeader.position}</th>
                        <th>{showTableHeader.country}</th>
                        <th>{showTableHeader.player}</th>
                        <th>{showTableHeader.total}</th>
                        {showTableHeader.all_rounds &&
                          showTableHeader.all_rounds.map((r, idx) => (
                            <th key={idx}>{r}</th>
                          ))}
                        <th>{showTableHeader.strokes}</th>
                      </>
                    )
                  }
                  </tr>
                </thead>
                <tbody>
                  {!loadingRedux && showLeaderboard && showLeaderboard.length !== 0 ? 
                    (<>
                        {showLeaderboard.map((item, idx)=>(
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
                        ))}
                    </>)
                   : loadingRedux && showLeaderboard ?
                   (<>
                    {showLeaderboard.map((item, idx)=>(
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
                    ))}
                  </>)
                  : null
                  }
                 
                </tbody>
            
              </Table>
              
            {/* ) : null
          } */}

          </Card>
        </Col>
        {/* {loading && 
          <Button style={{height:"100%"}}variant="primary" disabled>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            &nbsp;&nbsp; Loading...
          </Button>
        } */}
      </Row>
    </Container>
  );
};

export default Leaderboard;
