import React, { useState, useEffect } from 'react';

import axios from 'axios';

import {Table} from 'react-bootstrap';

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
  const [rounds, setRounds] = useState(0)

useEffect(()=>{
  getLeaderBoard()
      .then((res) => {
        setLeaderboard(res.leaderboard);
        setTournamentInfo(res.tournament_info);
        setVideos(res.tournament_info.videos)
        setTableHeader(res.table_header)
        // console.log(res.leaderboard.score_board.strokes)
      })
      .catch((err) => console.log(err));
},[])

const getRounds = (rounds) =>{
  let content =[]
  for (let i = 0; i < rounds; i++){
    content.push(<th>Round {i+1}</th>)
  }
  return content
}

  return (
    <>
    <h2>Tournament Info</h2>
      {tournamentInfo && (
        <>
          <div>{tournamentInfo.name}</div>
          <div>{tournamentInfo.date}</div>
        </>
      )}
      <br/>
      <h2>Leaderboard</h2>
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          {tableHeader && 
            <>
              <th>{tableHeader.position}</th>
              <th>{tableHeader.country}</th>
              <th>{tableHeader.player}</th>
              <th>{tableHeader.total}</th>
              {tableHeader.all_rounds && tableHeader.all_rounds.map((r, idx)=>(
                <th key={idx}>{r}</th>
              ))}
              <th>{tableHeader.strokes}</th>
            </>
        }

        </tr>
      </thead>
      <tbody>
        {leaderboard !== 0 ? leaderboard.map((item, idx)=>(
          <tr key={idx}>
            <td>{item.position}</td>
            <td>{item.country}</td>
            <td>{item.player}</td>
            <td>{item.score_board.total}</td>
            {item.score_board.rounds.map((round, idx2)=>(
              <td key={idx2}>{round}</td>
            ))}
            <td>{item.score_board.strokes}</td>
          </tr>
        )): <tr>No Leaderboard</tr>
        }
      </tbody>
    </Table>
    <br/>
      <h2>Videos</h2>
      {videos.length !== 0 ?
        videos.map((item, idx) => (
          <div key={idx}>
            <div>{item.title}</div>
            <div>{item.desc}</div>
            <div>{item.link}</div>
          </div>
        ))
      : <div>No Videos</div>
      }
    </>
  )
}

export default Leaderboard