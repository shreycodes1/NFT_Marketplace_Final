import NftCard from "./NftCard";
import { useEffect, useState } from "react";
import axios from "axios";

type NftData = {
  title: string;
  _id: string;
  description: string;
  ipfsHash: string;
  ownerAddress: string;
  tokenId: string; // or string, depending on your use case
  attributes: Array<Object>; // or define a specific type for attributes if known
};

const NftCardContainer = () => {
  const [data, setData] = useState<NftData[]>([]);
  async function fetchData() {
    try {
      await axios
        .get("https://nftproject-backend.vercel.app/nfts/getallnfts")
        .then((res) => {
          console.log("Res", res.data);
          setData(res.data);
        });
    } catch (error) {
      console.log({ error });
    }
  }
  // console.log(data[0]);
  // fetchData();
  useEffect(() => {
    console.log("check", data);
    if (data.length === 0) {
      // console.log("check");
      fetchData();
    }
  }, [data]);

  return (
    <section className="section explore" id="explore">
      <div className="container">
        <p className="section-subtitle">Exclusive Assets</p>

        <div className="title-wrapper">
          <h2 className="h2 section-title">Explore</h2>
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
    </section>
  );
};

export default NftCardContainer;
