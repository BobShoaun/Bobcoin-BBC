import React, { useState } from "react";
import { useSelector } from "react-redux";
import Blockchain from "../components/blockchain";
import Mempool from "../components/mempool";

// import { mineTransactions } from "../actions";
import { getHighestValidBlock } from "blockchain-crypto";

const Mine = () => {
	const blockchain = useSelector(state => state.blockchain);
	const transactions = useSelector(state => state.transactions);
	const [miner, setMiner] = useState("");
	const [headBlock, setHeadBlock] = useState(getHighestValidBlock(blockchain));
	// state = {
	// 	miner: "",
	// 	prevBlock: this.props.blockchain.highestBlock,
	// 	mempool: this.props.blockchain.getMempool(this.props.blockchain.highestBlock),
	// };
	const startMining = () => {
		// this.props.mineTransactions(this.state.miner, this.state.mempool, this.state.prevBlock);
	};
	const handlePrevBlockChange = height => {
		// const prevBlock = this.props.blockchain.chain.find(block => block.height == height);
		// if (prevBlock == undefined) return;
		// this.setState({ prevBlock, mempool: this.props.blockchain.getMempool(prevBlock) });
	};

	return (
		<section className="section">
			<h1 className="title is-2">Mine</h1>
			<p className="subtitle is-4">
				From the comfort of your browser! No need for unnessasary mining clients.
			</p>

			<div className="field">
				<label className="label">Miner's Public key</label>
				<input
					onChange={({ target }) => setMiner(target.value)}
					className="input"
					type="text"
					placeholder="Input miner's key"
				></input>
				<p className="help">The public key of the miner, where to send block reward.</p>
			</div>

			<div className="field">
				<label className="label">Mine from block #</label>
				<input className="input" type="number" placeholder="Input block height"></input>
				<p className="help">Which block to mine from.</p>
			</div>

			<div className="columns is-vcentered">
				<div className="column is-narrow mb-0">
					<button onClick={startMining} className="button mb-0">
						Start mining
					</button>
				</div>
				<div className="column is-10">
					<Blockchain style={{ width: "100%" }} className=""></Blockchain>
				</div>
			</div>
			<Mempool mempool={transactions}></Mempool>
		</section>
	);
};

export default Mine;
