import "./App.css";
import { Routes, Route } from "react-router-dom";
import MintNFT from "./pages/MintNFT";
import { MainPage } from "./pages/MainPage";
import { ExploreNFTs } from "./pages/ExploreNFTs";
import { MyNfts } from "./pages/MyNfts";
import NftDetailPage from "./componensts/nftDetails";

import MintTokens from "./pages/MintTokens";
import { BuyNFTS } from "./pages/BuyNFTs";
function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />}></Route>
          <Route path="/MintNft" element={<MintNFT />}></Route>
          <Route path="/ExploreNfts" element={<ExploreNFTs />}></Route>
          <Route path="/MyNfts/:ownerAddress" element={<MyNfts />}></Route>
          <Route path="/:_id" element={<NftDetailPage />}></Route>
          <Route path="/MintTokens" element={<MintTokens />}></Route>
          <Route path="/BuyNFTS" element={<BuyNFTS />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
