
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


const initialState={
  loading:false,
  leaderboard:{
      tournament_info:{
        name:"",
        date:"",
        video:[]
      },
      table_header:{
        position:"",
        country:"",
        player:"",
        total:"",
        all_rounds:[],
        strokes:""
      },
      leaderboard:[]
  },
  error:''
}
export const fetchLeaderboard = createAsyncThunk('fetchLeaderboard', ()=>{
  return axios
    .get('/api/pgatour/leaderboard')
    .then((res)=> res.data)
})

const leaderboardSlice = createSlice({
  name:'leaderboardState',
  initialState,
  extraReducers: (builder)=>{
    builder.addCase(fetchLeaderboard.pending, (state)=>{
      state.loading = true
    })
    builder.addCase(fetchLeaderboard.fulfilled, (state, action)=>{
      state.loading = false
      state.leaderboard = action.payload
      state.error = ''
    })
    builder.addCase(fetchLeaderboard.rejected, (state,action)=>{
      state.loading = false
      state.leaderboard = {}
      state.error = action.error.message
    })
  }
})
export default leaderboardSlice.reducer