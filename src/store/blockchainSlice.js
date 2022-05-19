import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const getMiningInfo = createAsyncThunk(
// 	"blockchain/getMiningInfo",
// 	async (_, { getState }) => {
// 		const api = getState().network.api;
// 		return (await axios.get(`${api}/mine/info`)).data;
// 	}
// );

// export const getHeadBlock = createAsyncThunk("blockchain/getHeadBlock", async (_, { getState }) => {
// 	const api = getState().network.api;
// 	return (await axios.get(`${api}/blockchain/head`)).data;
// });

// export const getUnconfirmedBlocks = createAsyncThunk(
// 	"blockchain/getUnconfirmedBlocks",
// 	async (_, { getState }) => {
// 		const api = getState().network.api;
// 		return (await axios.get(`${api}/blockchain/unconfirmed`)).data;
// 	}
// );

// export const getMempool = createAsyncThunk("blockchain/getMempool", async (_, { getState }) => {
// 	const api = getState().network.api;
// 	return (await axios.get(`${api}/transaction/mempool/info`)).data;
// });

const initialState = {
	// unconfirmedBlocks: [],
	// unconfirmedBlocksFetched: false,
	// matureBlocks: [],
	// matureBlocksFetched: false,
	// orphanedBlocks: [],
	// orphanedBlocksFetched: false,

	mempool: [],
	mempoolLoaded: false,
	headBlock: null,
	headBlockLoaded: false,
	recentBlocks: [],
	recentBlocksLoaded: false,
};

const blockchainSlice = createSlice({
	name: "blockchain",
	initialState,
	reducers: {
		// setUnconfirmedBlocks: (state, { payload: unconfirmedBlocks }) => {
		// 	state.unconfirmedBlocks = unconfirmedBlocks;
		// 	state.unconfirmedBlocksFetched = true;
		// },
		setMempool: (state, { payload: mempool }) => {
			state.mempool = mempool;
			state.mempoolLoaded = true;
		},
		setHeadBlock: (state, { payload: headBlock }) => {
			state.headBlock = headBlock;
			state.headBlockLoaded = true;
		},
		setRecentBlocks: (state, { payload: recentBlocks }) => {
			state.recentBlocks = recentBlocks;
			state.recentBlocksLoaded = true;	
		},
		reset: () => initialState,
	},
	// extraReducers: {
	// 	[getMiningInfo.fulfilled]: (state, { payload: { headBlock, mempool, unconfirmedBlocks } }) => {
	// 		state.unconfirmedBlocks = unconfirmedBlocks;
	// 		state.unconfirmedBlocksFetched = true;
	// 		state.mempool = mempool;
	// 		state.mempoolFetched = true;
	// 		state.headBlock = headBlock;
	// 		state.headBlockFetched = true;
	// 	},
	// 	[getHeadBlock.fulfilled]: (state, { payload: headBlock }) => {
	// 		state.headBlock = headBlock;
	// 		state.headBlockFetched = true;
	// 	},
	// 	[getUnconfirmedBlocks.fulfilled]: (state, { payload: unconfirmedBlocks }) => {
	// 		state.unconfirmedBlocks = unconfirmedBlocks;
	// 		state.unconfirmedBlocksFetched = true;
	// 	},
	// 	[getMempool.fulfilled]: (state, { payload: mempool }) => {
	// 		state.mempool = mempool;
	// 		state.mempoolFetched = true;
	// 	},
	// },
});

export const { reset, setMempool, setHeadBlock, setRecentBlocks } = blockchainSlice.actions;
export default blockchainSlice.reducer;
