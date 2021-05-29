import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import MineBlockchain from "./MineBlockchain";
import MineMempool from "./MineMempool";

import { newBlock } from "../../store/blockchainSlice";
import { newTransaction } from "../../store/transactionsSlice";
import { getHighestValidBlock, createCoinbaseTransaction } from "blockcrypto";

import Miner from "./miner.worker";

import "./mine.css";

const MinePage = () => {
	const dispatch = useDispatch();
	const blockchain = useSelector(state => state.blockchain.chain);
	const params = useSelector(state => state.blockchain.params);
	const transactions = useSelector(state => state.transactions);
	const [miner, setMiner] = useState(localStorage.getItem("add"));
	const [headBlock, setHeadBlock] = useState(null);
	const [selectedTxMap, setSelectedTxMap] = useState({});
	const [terminalLog, setTerminalLog] = useState([]);
	const [activeWorker, setActiveWorker] = useState(null);

	useEffect(() => {
		if (blockchain.length) setHeadBlock(getHighestValidBlock(blockchain));
	}, [blockchain]);

	const startMining = () => {
		if (activeWorker) {
			setTerminalLog(log => [
				...log,
				`\nAnother mining process is currently running, to terminate it type 'mine stop'.`,
			]);
			return;
		}

		const txToMine = transactions.filter(tx => selectedTxMap[tx.hash]);

		const coinbase = createCoinbaseTransaction(params, blockchain, headBlock, txToMine, miner);
		dispatch(newTransaction(coinbase));

		const worker = new Miner();
		worker.postMessage({
			params,
			blockchain,
			headBlock,
			txToMine: [coinbase, ...txToMine],
		});

		setActiveWorker(worker);

		worker.addEventListener("message", ({ data }) => {
			switch (data.message) {
				case "target":
					setTerminalLog(log => [
						...log,
						`\nMining started...\nprevious block: ${headBlock.hash}\ntarget hash: ${data.target}\n `,
					]);
					break;
				case "nonce":
					setTerminalLog(log => [...log, `nonce reached: ${data.block.nonce}`]);
					break;

				case "success":
					setTerminalLog(log => [
						...log,
						`\nMining successful! New block mined with...\nhash: ${data.block.hash}\nnonce: ${data.block.nonce}`,
					]);
					dispatch(newBlock(data.block));
					setActiveWorker(null);
					break;
			}
		});
	};

	const stopMining = () => {
		if (activeWorker) {
			activeWorker.terminate();
			setTerminalLog(log => [...log, `\nMining operation stopped.`]);
			setActiveWorker(null);
			return;
		}
		setTerminalLog(log => [...log, `\nNo mining processes running.`]);
	};

	const submitCommand = event => {
		event.preventDefault();
		const command = event.target.command.value;
		event.target.command.value = "";
		switch (command) {
			case "mine start":
				startMining();
				break;
			case "mine stop":
				stopMining();
				break;
			case "help":
				setTerminalLog(log => [
					...log,
					`\nCrappy ${params.name} mining terminal v1.0.0-beta\n\nList of commands:\nmine start\nmine stop\nhelp`,
				]);
				break;
			default:
				setTerminalLog(log => [...log, `\nunknown command: ${command}, type 'help' for help.`]);
		}
	};

	return (
		<section className="section">
			<h1 className="title is-2">Mine</h1>
			<p className="subtitle is-4">
				From the comfort of your browser! No need for unnessasary mining clients.
			</p>
			<hr />

			<div className="mb-6">
				<MineBlockchain selectBlock={setHeadBlock}></MineBlockchain>
			</div>

			<section className="is-flex mb-6">
				<section className="terminal mr-6" style={{ width: "60%" }}>
					<div className="mt-auto content" style={{ width: "100%" }}>
						{terminalLog.map((log, index) => (
							<pre className="terminal-output" key={index}>
								{log}
							</pre>
						))}
						<div className="is-flex is-align-items-center">
							<span className="mr-2">&gt;</span>
							<form onSubmit={submitCommand} className="is-block" style={{ width: "100%" }}>
								<input
									className="terminal-input"
									name="command"
									type="text"
									autoComplete="off"
									style={{ width: "100%" }}
								/>
							</form>
						</div>
					</div>
				</section>
				<section style={{ width: "40%" }}>
					<div className="field mb-4">
						<label className="label">Miner's Address</label>
						<input
							onChange={({ target }) => setMiner(target.value)}
							value={miner}
							className="input"
							type="text"
							placeholder="Input miner's key"
						></input>
						<p className="help">The address of the miner, where to send block reward and fees.</p>
					</div>

					<div className="field mb-5">
						<label className="label">Head block</label>
						<input
							value={headBlock?.hash ?? "-"}
							className="input"
							type="text"
							placeholder="Enter block hash"
							readOnly
						></input>
						<p className="help">Which block to mine from.</p>
					</div>

					<button onClick={activeWorker ? stopMining : startMining} className="button mb-0">
						<i className="material-icons mr-2">engineering</i>
						{activeWorker ? "Stop mining" : "Start mining"}
					</button>
				</section>
			</section>

			<h3 className="title is-4">Mempool</h3>
			<p className="subtitle">Select transactions to include from the mempool.</p>
			<hr />
			<MineMempool
				headBlock={headBlock}
				updateSelectedTransactions={txs => setSelectedTxMap(txs)}
			></MineMempool>
		</section>
	);
};

export default MinePage;
