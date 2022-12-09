import {legacy_createStore as createStore, applyMiddleware} from 'redux'
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from "redux-thunk";
// import thunkMiddleware from "redux-thunk";
import fetchPlayers from './playerSlice'
import fetchPlayerDetail from './playerDetailSlice'
import fetchLeaderboard from './leaderboardSlice'
import { configureStore } from '@reduxjs/toolkit'

const middleware = [thunk];
// const store= createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)))
const store= configureStore({
  reducer:{
    players: fetchPlayers,
    playerDetail: fetchPlayerDetail,
    leaderboard: fetchLeaderboard
  }// middleware:[thunk]
})

// console.log('Initial state', store.getState())
// const unsubscribe = store.subscribe(()=> console.log('Updated state: ', store.getState()))
// store.dispatch()
// unsubscribe()
export default store