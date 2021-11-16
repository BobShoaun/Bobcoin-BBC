import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import Loading from "../../components/Loading";

import { formatDistanceToNow } from "date-fns";
import "./blockchain.css";

import axios from "axios";

const BlockchainPage = () => {
  const api = useSelector(state => state.network.api);
  const headBlock = useSelector(state => state.blockchain.headBlock);

  const [blockchain, setBlockchain] = useState([]);
  const [currentHeight, setCurrentHeight] = useState(0);

  const [blocks, setBlocks] = useState([]);
  const [page, setPage] = useState(0); // 0 indexed page
  const transactionsSection = useRef(null);
  const transactionsPerPage = 10;
  const numFirstPages = 10;
  const numLastPages = 2;

  const limit = 10;

  const loadBlockchain = async height => {
    const result = await axios.get(`${api}/blockchain/blocks?height=${height}&limit=${limit}`);
    setBlockchain(blockchain => [...blockchain, ...result.data]);
    setCurrentHeight(height);
  };

  useEffect(() => {
    if (!headBlock) return;
    loadBlockchain(headBlock.height);
  }, [api, headBlock]);

  if (!blockchain.length)
    return (
      <div style={{ height: "70vh" }}>
        <Loading />
      </div>
    );

  const statusColor = status => {
    switch (status) {
      case "Confirmed":
        return "has-background-success";
      case "Unconfirmed":
        return "has-background-warning";
      case "Orphaned":
        return "has-background-danger";
      default:
        return "has-background-primary";
    }
  };

  return (
    <section className="section">
      <h1 className="title is-size-4 is-size-2-tablet">Blockchain</h1>
      <p className="subtitle is-size-6 is-size-5-tablet mb-5">Explore the entire chain up to the genesis block.</p>

      <div className="card blockchain-list px-3 px-5-tablet mb-5" style={{ paddingBlock: "2em", overflow: "auto" }}>
        <p className="title mb-0 has-text-centered" style={{ fontSize: ".87rem", minWidth: "2em" }}>
          #
        </p>
        <p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "10em" }}>
          Hash
        </p>
        <p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "6em" }}>
          Timestamp
        </p>
        <p className="title mb-0" style={{ fontSize: ".87rem", minWidth: "8em" }}>
          Miner
        </p>
        <p className="title mb-0 has-text-centered" style={{ fontSize: ".87rem", minWidth: "7em" }}>
          Status
        </p>

        <hr className="my-0" />
        <hr className="my-0" />
        <hr className="my-0" />
        <hr className="my-0" />
        <hr className="my-0" />

        {blockchain.map(({ block, status }) => (
          <React.Fragment key={block.hash}>
            <p
              className="subtitle mb-0 has-text-centered"
              style={{
                fontSize: ".87rem",
                textDecoration: status === "Orphaned" ? "line-through" : "none",
              }}
            >
              {block.height}
            </p>
            <p className="subtitle mb-0 truncated" style={{ fontSize: ".87rem" }}>
              <Link to={`/block/${block.hash}`}>{block.hash}</Link>
            </p>
            <p className="subtitle mb-0" style={{ fontSize: ".87rem" }}>
              {formatDistanceToNow(block.timestamp, { addSuffix: true, includeSeconds: true })}
            </p>
            <p className="subtitle mb-0 truncated" style={{ fontSize: ".87rem" }}>
              <Link to={`/address/${block.transactions[0].outputs[0].address}`}>
                {block.transactions[0].outputs[0].address ?? "-"}
              </Link>
            </p>
            <p className="mb-0 has-text-centered">
              <span
                style={{ borderRadius: "0.3em" }}
                className={`title is-7 py-1 px-2 has-background-success has-text-white ${statusColor(status)}`}
              >
                {status}
              </span>
            </p>
          </React.Fragment>
        ))}
      </div>
      <div className="has-text-centered">
        <button
          onClick={() => loadBlockchain(currentHeight - limit)}
          disabled={currentHeight < limit}
          className="button"
        >
          Load more
        </button>
      </div>
    </section>
  );
};

export default BlockchainPage;
