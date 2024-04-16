import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import NftCard from "../componensts/NftCard";

type NftData = {
  title: string;
  _id: string;
  description: string;
  ipfsHash: string;
  ownerAddress: string;
  tokenId: string; // or string, depending on your use case
  attributes: Array<Object>; // or define a specific type for attributes if known
};

export const MyNfts = () => {
  const [data, setData] = useState<NftData[]>([]);
  const { isConnected } = useAccount();
  const params = useParams();
  async function fetchData() {
    try {
      await axios
        .get(
          `https://nftproject-backend.vercel.app/nfts/getownersnfts/${params.ownerAddress}`
        )
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
        });
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    // setOwnerAddress(localStorage.getItem("address"));
    console.log("check", data);
    // if (data.length === 0) {
    fetchData();
    // }
  }, []);
  return (
    <div>
      <section className="section explore" id="explore">
        {isConnected ? (
          <div className="container">
            <p className="section-subtitle">Exclusive Assets You Owned</p>

            <div className="title-wrapper">
              <h2 className="h2 section-title">Explore Your Own Nfts</h2>
            </div>

            <ul className="grid-list">
              {data?.map((e, i) => {
                return (
                  <li key={i}>
                    <NftCard
                      src={e.ipfsHash}
                      title={e.title}
                      ownerAddress={e.ownerAddress}
                      _id={e._id}
                      ipfsHash={e.ipfsHash}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="container">
            <p className="section-subtitle">Exclusive Assets You Owned</p>

            <div className="title-wrapper">
              <h2 className="h2 section-title">Explore Your Own Nfts</h2>
            </div>

            <h1>Please Login.</h1>
          </div>
        )}
      </section>
    </div>
  );
};
