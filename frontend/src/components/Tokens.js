import React from 'react';
import "../App.css";
import tokenList from "../tokenList.json";

function Tokens() {
  return (
    <div className="tokenRow" id="tokenRow">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenTable"
                key={i}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                  <div className="tokenTicker">{e.address}</div>
                </div>
              </div>
            );
          })}
        </div>
  )
}

export default Tokens;
