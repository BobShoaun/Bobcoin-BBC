const {
  NODE_ENV,
  REACT_APP_BOBCOIN_NODE_ALPHA_MAINNET_URL,
  REACT_APP_BOBCOIN_NODE_ALPHA_TESTNET_URL,
  REACT_APP_BOBCOIN_NODE_LOCAL_MAINNET_URL,
  REACT_APP_BOBCOIN_NODE_LOCAL_TESTNET_URL,
  REACT_APP_RECAPTCHA_SITE_KEY,
} = process.env;

const development = NODE_ENV === "development";
const useProdNodeInDev = true;

export const recaptchaSiteKey = REACT_APP_RECAPTCHA_SITE_KEY;

export const nodes = [
  { name: "alpha-mainnet", url: REACT_APP_BOBCOIN_NODE_ALPHA_MAINNET_URL },
  { name: "alpha-testnet", url: REACT_APP_BOBCOIN_NODE_ALPHA_TESTNET_URL },
  { name: "local-mainnet", url: REACT_APP_BOBCOIN_NODE_LOCAL_MAINNET_URL },
  { name: "local-testnet", url: REACT_APP_BOBCOIN_NODE_LOCAL_TESTNET_URL },
];

export const VCODE = {
  BK00: 0,
  BK01: 1,
  BK02: 2,
  BK03: 3,
  BK04: 4,
  BK05: 5,
  BK06: 6,
  BK07: 7,

  TX00: 100,
  TX01: 101,
  TX02: 102,
  TX03: 103,
  TX04: 104,
  TX05: 105,
  TX06: 106,
  TX07: 107,
  TX08: 108,
  TX09: 109,
  TX10: 110,
  TX11: 111,

  CB00: 200,
  CB01: 201,
  CB02: 202,
  CB03: 203,
  CB04: 204,
  CB05: 205,
  CB06: 206,
  CB07: 207,

  BC00: 300,
  BC01: 301,
  BC02: 302,
  BC03: 303,
  BC04: 304,
  BC05: 305,

  VALID: 400,
};

// export const bobcoinMainnet =
//   development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL_MAIN : REACT_APP_BOBCOIN_NODE_MAIN;

// export const bobcoinTestnet =
//   development && !useProdNodeInDev ? REACT_APP_BOBCOIN_NODE_LOCAL_TEST : REACT_APP_BOBCOIN_NODE_TEST;
