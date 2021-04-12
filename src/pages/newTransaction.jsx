import React, { Component } from "react";
import { connect } from "react-redux";
import { addTransaction } from "../actions";
import { getKeyPair, Transaction } from "blockchain-crypto";

class NewTransaction extends Component {
	state = {
		showPrivateKey: false,
		amount: "",
		senderPrivateKey: "",
		senderPublicKey: "",
		recipientPublicKey: "",
	};
	handleAmountChange = amount => {
		this.setState({ amount });
	};
	handleSenderKeyChange = privateKey => {
		try {
			const keypair = getKeyPair(privateKey);
			this.setState({ senderPrivateKey: privateKey, senderPublicKey: keypair.getPublic("hex") });
		} catch {
			this.setState({ senderPrivateKey: "", senderPublicKey: "" });
		}
	};
	createTransaction = () => {
		const transaction = new Transaction(
			this.state.senderPublicKey,
			this.state.recipientPublicKey,
			this.state.amount,
			0
		);
		transaction.sign(this.state.senderPrivateKey);
		this.props.addTransaction(transaction);
	};
	render() {
		return (
			<section className="section">
				<h1 className="title is-2">New Transaction</h1>
				<p className="subtitle is-4">Create and sign a new transaction.</p>

				<div className="field">
					<label className="label">Sender's Private key</label>
					<div className="field has-addons mb-0">
						<div className="control is-expanded">
							<input
								className="input"
								type={this.state.showPrivateKey ? "text" : "password"}
								placeholder="Enter private key"
								onChange={({ target: { value } }) => this.handleSenderKeyChange(value)}
							></input>
						</div>
						<p className="control">
							<button
								onClick={() => this.setState({ showPrivateKey: !this.state.showPrivateKey })}
								className="button is-light"
							>
								<i className="material-icons md-18">
									{this.state.showPrivateKey ? "visibility_off" : "visibility"}
								</i>
							</button>
						</p>
					</div>
					<p className="help">You can only spend from wallets which you have the private key.</p>
				</div>

				<div className="field">
					<label className="label">Sender's Public key</label>
					<input
						value={this.state.senderPublicKey}
						className="input"
						type="text"
						placeholder="Input private key above to get public key"
						readOnly
					></input>
					<p className="help">The public key of the sender generated from the private key above.</p>
				</div>

				<div className="field">
					<label className="label">Recipient's Public key</label>
					<input
						className="input"
						type="text"
						placeholder="Enter public key"
						onChange={({ target: { value } }) => this.setState({ recipientPublicKey: value })}
					></input>
					{/* <p className="help">The public key of the recipient of this transaction.</p> */}
				</div>

				<div className="field">
					<label className="label">Amount (BBC)</label>
					<input
						value={this.state.amount}
						onChange={({ target }) => this.handleAmountChange(target.value)}
						onBlur={({ target }) => this.handleAmountChange(Number(target.value).toFixed(6))}
						step="0.01"
						className="input"
						type="number"
						placeholder="Enter amount in BBC"
					></input>
					{/* <p className="help">The public key of the recipient of this transaction.</p> */}
				</div>

				<div className="buttons is-pulled-right">
					<button className="button">Cancel</button>
					<button className="button is-info" onClick={this.createTransaction}>
						Create & Sign
					</button>
				</div>
				<div className="is-clearfix"></div>
			</section>
		);
	}
}

// const mapDispatchToProps = () => ({
//   addTransaction
// })

const mapStateToProps = state => ({
	transactions: state.transactions,
});

export default connect(mapStateToProps, { addTransaction })(NewTransaction);
