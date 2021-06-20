import React, { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";

import { useBlockchain } from "../../hooks/useBlockchain";

import {
	calculateBalance,
	getHighestValidBlock,
	isAddressValid,
	getAddressTxs,
	getTxBlock,
	findTXO,
	calculateUTXOSet,
} from "blockcrypto";
import QRCode from "qrcode";
import { copyToClipboard } from "../../helpers";

import Transaction from "../../components/Transaction";
import Loading from "../../components/Loading";

const AddressPage = () => {
	const { address } = useParams();
	const history = useHistory();
	const location = useLocation();
	const searchInput = useRef();
	const [addressQR, setAddressQR] = useState("");

	const [loading, params, blockchain, transactions] = useBlockchain();

	const headBlockHash = useMemo(() => new URLSearchParams(location.search).get("head"), [location]);

	const headBlock = useMemo(
		() =>
			blockchain.find(block => block.hash === headBlockHash) ??
			getHighestValidBlock(params, blockchain),
		[blockchain, params, headBlockHash]
	);

	const utxos = useMemo(
		() =>
			loading
				? []
				: calculateUTXOSet(blockchain, headBlock).filter(utxo => utxo.address === address),
		[blockchain, headBlock, address]
	);

	const balance = useMemo(
		() => (utxos.reduce((prev, curr) => prev + curr.amount, 0) / params.coin).toFixed(8),
		[utxos, params]
	);

	const [receivedTxs, sentTxs] = useMemo(
		() => (headBlock ? getAddressTxs(blockchain, headBlock, address) : [[], []]),
		[blockchain, headBlock, address]
	);

	const totalReceived = useMemo(
		() =>
			receivedTxs.reduce(
				(total, curr) =>
					total +
					curr.outputs
						.filter(out => out.address === address)
						.reduce((outT, outC) => outT + outC.amount, 0),
				0
			),
		[receivedTxs]
	);

	const totalSent = useMemo(
		() =>
			sentTxs.reduce(
				(total, curr) =>
					total +
					curr.inputs.reduce((inT, inC) => {
						const txo = findTXO(inC, transactions);
						return inT + (txo.address === address ? txo.amount : 0);
					}, 0),
				0
			),
		[sentTxs, transactions]
	);

	let isValid = false;
	try {
		isValid = isAddressValid(params, address);
	} catch {}

	useEffect(() => {
		QRCode.toString(address).then(setAddressQR);
	}, [address]);

	if (loading || !blockchain.length)
		return (
			<div style={{ height: "70vh" }}>
				<Loading />
			</div>
		);

	const handleSearch = event => {
		event.preventDefault();
		history.push(`./${searchInput.current.value}`);
	};

	return (
		<section className="section">
			<div className="is-flex-tablet is-align-items-end mb-5">
				<div className="">
					<h1 className="title is-size-4 is-size-2-tablet">Address</h1>
					<p className="subtitle is-size-6 is-size-5-tablet mb-3">
						See this address's balance, transaction history, and more.
					</p>
				</div>
				<form onSubmit={handleSearch} className="ml-auto" style={{ minWidth: "20em" }}>
					<p className="control has-icons-left">
						<input
							ref={searchInput}
							className="input"
							type="search"
							placeholder="Search for an address"
						/>
						<span className="icon is-left is-small">
							<i className="material-icons">search</i>
						</span>
					</p>
				</form>
			</div>
			<div className="is-flex-tablet is-align-items-center mb-6">
				<p
					dangerouslySetInnerHTML={{ __html: addressQR }}
					className="mx-auto mb-6 mr-6-tablet mb-0-tablet box"
					style={{ width: "300px" }}
				></p>
				<table className="table is-fullwidth">
					<tbody>
						<tr>
							<td>Address</td>
							<td className="is-flex" style={{ wordBreak: "break-all" }}>
								{address}

								<span
									onClick={() => copyToClipboard(address)}
									className="material-icons-outlined md-18 my-auto ml-2 is-clickable"
									style={{ color: "lightgrey" }}
								>
									content_copy
								</span>
							</td>
						</tr>
						<tr>
							<td>Valid?</td>
							<td>
								{isValid ? (
									<div className="icon has-text-success ml-auto">
										<i className="material-icons">check_circle_outline</i>
									</div>
								) : (
									<div className="icon has-text-danger ml-auto">
										<i className="material-icons">dangerous</i>
									</div>
								)}
							</td>
						</tr>
						<tr>
							<td>Transaction count</td>
							<td>{receivedTxs.length + sentTxs.length}</td>
						</tr>
						<tr>
							<td>UTXO count</td>
							<td>{utxos.length}</td>
						</tr>
						<tr>
							<td>Total Received</td>
							<td>
								{(totalReceived / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
						<tr>
							<td>Total Sent</td>
							<td>
								{(totalSent / params.coin).toFixed(8)} {params.symbol}
							</td>
						</tr>
						<tr>
							<td>Final Balance</td>
							<td className="has-text-weight-semibold">
								{balance} {params.symbol}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h1 className="title is-size-5 is-size-4-tablet mb-3">Inbound Transactions</h1>
			<div className="mb-6">
				{receivedTxs.length ? (
					receivedTxs
						.sort((a, b) => b.timestamp - a.timestamp)
						.map(tx => (
							<div key={tx.hash} className="card mb-2">
								<div className="card-content">
									<Transaction
										transaction={tx}
										block={getTxBlock(blockchain, headBlock.hash, tx)}
										headBlock={headBlock}
									/>
								</div>
							</div>
						))
				) : (
					<div className="has-background-white py-4">
						<p className="subtitle is-6 has-text-centered">
							No one has sent {params.name}s to this address.
						</p>
					</div>
				)}
			</div>

			<h1 className="title is-size-5 is-size-4-tablet mb-3">Outbound Transactions</h1>
			{sentTxs.length ? (
				sentTxs
					.sort((a, b) => b.timestamp - a.timestamp)
					.map(tx => (
						<div key={tx.hash} className="card mb-2">
							<div className="card-content">
								<Transaction
									transaction={tx}
									block={getTxBlock(blockchain, headBlock.hash, tx)}
									headBlock={headBlock}
								/>
							</div>
						</div>
					))
			) : (
				<div className="has-background-white py-4">
					<p className="subtitle is-6 has-text-centered">
						This address has not sent any {params.name}s.
					</p>
				</div>
			)}
		</section>
	);
};

export default AddressPage;