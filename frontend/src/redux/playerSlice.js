
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
  loading:false,
  players:[],
  error:''
}
export const fetchPlayers = createAsyncThunk('fetchPlayers', ()=>{
  return axios
  .get('/api/pgatour/players')
  .then((res)=> res.data.map((payload)=> payload))
  
})

const playerSlice = createSlice({
  name:'player',
  initialState,
  extraReducers: (builder)=>{
    builder.addCase(fetchPlayers.pending, (state)=>{
      state.loading = true
    })
    builder.addCase(fetchPlayers.fulfilled, (state, action)=>{
      state.loading = false
      state.players = action.payload
      state.error = ''
    })
    builder.addCase(fetchPlayers.rejected, (state,action)=>{
      state.loading = false
      state.players = []
      state.error = action.error.message
    })
  }
})
export default playerSlice.reducer

// export const reducer = (state=initialState, action)=>{
//   switch(action.type){
//     case FETCH_PLAYERS_REQUEST:
//       return {
//         ...state,
//         loading:true
//       }
//     case FETCH_PLAYERS_SUCCESS:
//       return {
//         ...state,
//         loading:false,
//         players: action.payload,
//         error:''
//       }
//     case FETCH_PLAYERS_FAILURE:
//       return {
//         ...state,
//         loading:false,
//         players:[],
//         error: action.payload
//       }
//     default: return state
//   }
// }