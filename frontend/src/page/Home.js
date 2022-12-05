import { useState, useEffect } from 'react';

import axios from 'axios';

const getPlayers = async () => {
  const { data } = await axios.get('/api/pgatour/players');
  return data;
};

const getLeaderBoard = async () => {
  const { data } = await axios.get('/api/pgatour/leaderboard');
  console.log('data:::: ', data);
  return data;
};
const Home = () => {
  const [players, setPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tournamentInfo, setTournamentInfo] = useState();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getPlayers()
      .then((res) => {
        setPlayers(res);
        console.log(res);
      })
      .catch((err) => console.log(err));

    getLeaderBoard()
      .then((res) => {
        setLeaderboard(res.leaderboard);
        setTournamentInfo(res.tournament_info);
        setVideos(res.tournament_info.videos)
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1>PGA Tour</h1>
      <h2>Players</h2>
      {/* {players.map((item, idx)=>(
        <div key={idx}>
          <div>{item.name}</div>
          <div>{item.country}</div>
          <img src={item.image} alt="player"></img>
        </div>
      )) } */}
      <h2>Tournament Info</h2>
      {tournamentInfo && (
        <>
          <div>{tournamentInfo.name}</div>
          <div>{tournamentInfo.date}</div>
        </>
      )}
      <h2>Leaderboard</h2>
      {leaderboard && leaderboard.map((item, idx)=>(
        <div key={idx}>
          <div>{item.position}</div>
          <div>{item.country}</div>
          <div>{item.player}</div>
          <div>{item.score_board.total}</div>
          {item.score_board.rounds.map((round, idx2)=>(
            <div key={idx2}>Round {idx2+1} {round}</div>
          ))}
          <div>{item.score_board.strokes}</div>
        </div>
      ))}
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
  );
};

export default Home;
