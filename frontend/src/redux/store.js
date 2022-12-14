import {legacy_createStore as createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from "redux-thunk";
// import thunkMiddleware from "redux-thunk";
import fetchPlayers from './playerSlice'
// import fetchPlayerDetail from './playerDetailSlice'
import fetchLeaderboard from './leaderboardSlice'
import { configureStore } from '@reduxjs/toolkit'

const middleware = [thunk];
const store= configureStore({
  reducer:{
    players: fetchPlayers,
    // playerDetail: fetchPlayerDetail,
    leaderboardState: fetchLeaderboard
  }
})
export default store