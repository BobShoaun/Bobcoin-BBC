import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { isTransactionValid } from "blockchain-crypto";

const Transaction = ({ transaction }) => {
	const params = useSelector(state => state.blockchain.params);

	const totalInputAmount = transaction.inputs.reduce((total, input) => total + input.amount, 0);
	const totalOutputAmount = transaction.outputs.reduce((total, output) => total + output.amount, 0);
	const fee = totalInputAmount - totalOutputAmount;
	const normalTransaction = transaction.type !== "coinbase" && transaction.type !== "fee";

	const keyText = {
		// maxWidth: "20em",
		display: "block",
		whiteSpace: "pre-wrap",
		wordWrap: "break-word",
	};
	const signatureText = {
		// display: "block",
		maxWidth: "55em",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
	};

	const TransactionInputRender = () => {
		switch (transaction.type) {
			case "coinbase":
				return <p>COINBASE (Newly Minted Coins)</p>;
			case "fee":
				return <p>Miner's Fee Reward</p>;
			default:
				return (
					<Link to={`/wallet/${transaction.inputs[0].address}`}>
						{transaction.inputs[0].address}
					</Link>
				);
		}
	};

	return (
		<div className="">
			<div className="is-flex mb-1">
				<h3 className="title is-6 mb-0">Hash: &nbsp;</h3>
				<Link to={`/transaction/${transaction.hash}`} className="">
					<p className="subtitle is-6 mb-0"> {transaction.hash ?? "no hash"}</p>
				</Link>
				<p className="ml-auto subtitle is-6 mb-0">
					{new Date(transaction.outputs[0].timestamp).toUTCString()}
				</p>
				{isTransactionValid(transaction) ? (
					<div className="icon has-text-success ml-3">
						<i className="material-icons">check_circle_outline</i>
					</div>
				) : (
					<div className="icon has-text-danger ml-3">
						<i className="material-icons">dangerous</i>
					</div>
				)}
			</div>

			{normalTransaction && (
				<div className="is-flex is-justify-content-start is-align-items-baseline mb-2">
					<h3 className="title is-6 mb-0">Signature: &nbsp;</h3>
					<p style={signatureText} className="subtitle is-6 mb-0">
						{transaction.signature}
					</p>
				</div>
			)}

			<div className="is-flex mb-2">
				<div style={keyText}>
					<TransactionInputRender />
				</div>
				<div className="has-text-centered" style={{ width: "5em" }}>
					<i className="material-icons">arrow_right_alt</i>
				</div>
				<div>
					{transaction.outputs.map(output => (
						<Link style={keyText} to={`/wallet/${output.address}`}>
							{output.address}
						</Link>
					))}
				</div>
				<div className="ml-auto" style={{ width: "" }}>
					{transaction.outputs.map(output => (
						<p className="has-text-weight-medium">
							{(output.amount / params.coin).toFixed(8)} {params.symbol}
						</p>
					))}
				</div>
			</div>
			<div className="has-text-right">
				<span
					className="title is-6 is-inline-block mb-1 py-1 px-3"
					style={{ background: "#353535", color: "white", borderRadius: "0.3em" }}
				>
					Amount = {(totalOutputAmount / params.coin).toFixed(8)} {params.symbol}
				</span>
				{normalTransaction && (
					<div>
						<span
							className="title is-6 is-inline-block mb-1 py-1 px-3"
							style={{ background: "lightgray", borderRadius: "0.3em" }}
						>
							Fee = {(fee / params.coin).toFixed(8)} {params.symbol}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Transaction;
