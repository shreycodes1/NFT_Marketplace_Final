// import nft from "../utilities/auction-11.jpg";
import { Link } from "react-router-dom";

type AppProps = {
  title: string;
  src: string | any;
  ownerAddress: any | null;
  _id: string;
  ipfsHash: string;
  isforList?: boolean;
};
const NftCard = (props: AppProps) => {
  return (
    <div className="card explore-card">
      <figure className="card-banner">
        <a>
          <img
            src={`https://ipfs.io/ipfs/${props.ipfsHash}`}
            width="600"
            height="600"
            loading="lazy"
            alt="Walking On Air"
            className="img-cover"
          />
        </a>
      </figure>

      <h3 className="h3 card-title">
        <a>{props.title}</a>
      </h3>

      <span className="card-author">
        Owned By{" "}
        <a className="author-link">
          {props.ownerAddress?.slice(0, 8) +
            "..." +
            props.ownerAddress?.slice(35, 45)}
        </a>
      </span>

      <div className="wrapper">
        <span className="wrapper-item">1 of 1</span>
        <Link to={`/${props._id}`}>
          <button className="btn">
            <span>Details</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NftCard;
