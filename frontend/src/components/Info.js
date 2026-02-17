import React from 'react';
import "../App.css";
import machine from './img/espressoMachine_S.png'
import coin from './img/coinUSD_S.png'
import plant from './img/tablePlant_S.png'
import drink from './img/softDrink.png'
import arrow from './img/yellow-arrow-down-11364.svg'

function Info() {
  return (
   <>
   <div className="parent">
        <div className="infocard">
            <h2>Roadmap: Starts on 2024-2025</h2>
            <p>1. Create a stake rewards section</p><img className="infoimg" src={machine} alt="stake" />
            <img src={arrow} className="yellowarrow" alt="arrow"/>
            <p>2. Create token or token ecosystem</p><img className="infoimg" src={coin} alt="token"/>
            <img src={arrow} className="yellowarrow" alt="arrow"/>
            <p>3. Integrate multichain</p><img src={plant} className="infoimg" alt="multichain"/>
            <img src={arrow} className="yellowarrow" alt="arrow"/>
            <p>4. Add more nft to refinable</p><img src={drink} className="infodrink" alt="nft"/>
            <br /><br />
        </div>
        <div className="infotxt">
        <h2>AtacamaSwap</h2>
        <p>Is a cryptocurrency decentralize exchange, it functions with our ERC-20 smart contract that are in charge of all transactions and liquidity pools to perform the swap, Atacama Swap act as a front-end, and the back-end and security are resolve also 100% non-custodial, meaning that user's funds are not held by the protocol or platform.
                 </p>
                 <p>This web App is not optimize on movil device.</p> 
                <p>You can paste the contract on the field search and press arrow</p>
                <p>If you can't perform the swap probably is because the pool of the pair is non-existing, check if the pool exist on sites like coingecko or  coinmarketcap.</p>  
                <h2>Advantages of using a DEX</h2>
    <p>Token availability: Centralized exchange´s have to individually vet tokens and ensure they comply with local regulations before listing them. Decentralized exchange´s can include any token minted on the blockchain they are built upon, meaning that new projects will likely list on these exchange´s before being available on their centralized counterparts.
    </p>
    <p>While this can mean traders can get in as early as possible on projects, it also implies that all sorts of scams are listed on DEXs. A common scam is known as a “rug pull,” a typical exit scam. Rug pulls occur when the team behind a project dumps the tokens used to provide liquidity on these exchange´s pools when their price goes up, making it impossible for other trades to sell.
    </p>
    <p>
    Anonymity: When users exchange one cryptocurrency for another, their anonymity is preserved on DEXs. In contrast to centralized exchange´s, users do not need to go through a standard identification process known as Know Your Customer (KYC). KYC processes involve collecting trader´s personal information, including their full legal name and a photograph of their government-issued identification document. As a result, DEXs attract a large number of people who do not wish to be identified.
    
    <p>Reduced security risks: Experienced cryptocurrency users who custody their funds are at a reduced risk of being hacked using DEXs, as these exchange´s do not control their funds. Instead, traders guard their funds and only interact with the exchange when they wish to do so. If the platform gets hacked, only liquidity providers may be at risk.
    </p>
    <p>Reduced counterparty risk: Counterparty risk happens when the other party involved in a transaction does not fulfill its part of the deal and defaults on its contractual obligations. Because decentralized exchange´s operate without intermediaries and are based on smart contracts, this risk is eliminated. We do not collect any kind of data.
    </p>
    <h2>Technical Risks</h2>
    <p>Given the nature of Digital Assets and their underlying technologies, there are a number of intrinsic risks, including but not limited to:
      faults, defects, hacks, exploits, errors, protocol failures or unforeseen circumstances occurring in respect of a Digital Asset or the technologies or economic systems on which the Digital Asset rely;
      transactions in Digital Assets being irreversible. </p>
      <p>Consequently, losses due to fraudulent or accidental transactions may not be recoverable;
      technological development leading to the obsolescence of a Digital Asset; delays causing transactions not be settled on the scheduled delivery date; and
      attacks on the protocol or technologies on which a Digital Asset depends, including, but not limited to: distributed denial of service, sybil attacks, phishing, social engineering, hacking, smurfing, malware, double spending, majority-mining, consensus-based or other mining attacks, misinformation campaigns, forks and spoofing.
      A common scam is known as a “rug pull”, a typical exit scam. Rug pulls occur when the team behind a project dumps the tokens used to provide liquidity on these exchange´s pools when their price goes up, making it impossible for other trades to sell.</p>
    <h2>Market Risk</h2>
      <p>Digital Asset trading is subject to high market risk and price volatility. Changes in value may be significant and may occur rapidly and without warning. Past performance is not a reliable indicator of future performance. The value of an investment and any returns can go down as well as up, and you may not get back the amount you had invested. </p>
        <p>Digital Assets may have limited liquidity, which may make it difficult or impossible for you to sell or exit a position when you wish to do so. This may occur at any time, including at times of rapid price movements. Digital Asset markets are open 24 hours a day, 7 days a week. Rapid price changes may occur at any time, including outside of normal business hours.</p>
    </p><h2>Responsibility</h2>
    <p>Decentralized exchange´s allow users to trade directly from their wallets by interacting with the smart contracts behind the trading platform. Traders guard their funds and are responsible for losing them if they make mistakes, such as losing their private keys or sending funds to the wrong addresses.
      Due to this, AtacamaSwap has no responsibility on any kind of fraud, it is hard for these platforms to enforce Know Your Customer and Anti-Money Laundering checks, as there is no central entity verifying the type of information traditionally submitted to centralized platforms. Regulators may nevertheless attempt to implement these checks on decentralized platforms.
      Regulations applied to custodians would also not apply to these platforms, as those that do accept user´s deposits still require users to sign messages on the blockchain to move funds off of their platforms.</p>
      <p>It is not possible for AtacamaSwap to eliminate all security risks. You are responsible for keeping your MetaMask Account password safe, and you may be responsible for all the transactions under your MetaMask Account, whether you authored them or not. Transactions in Digital Assets may be irreversible, and losses due to fraudulent or unauthorized transactions may not be recoverable.</p>
  </div> </div>
  </>
  )
}

export default Info;
