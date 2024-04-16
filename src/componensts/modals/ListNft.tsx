import React, { useState, useEffect } from "react";
import { useNFTFunctionwriter } from "../../utils/hooks";
import { useWaitForTransaction } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { parseEther } from "viem";
import ModelLoader from "./Loader";
import { useNavigate } from "react-router-dom";
interface Props {
  isOpenProp: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  id: string | null | undefined;
  _id: string | null | undefined;
}

const ListModal: React.FC<Props> = ({ isOpenProp, onClose, id, _id }) => {
  const navigate = useNavigate();

  const [isLoader, setIsLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(isOpenProp);
  const [price, setNumber] = useState(0);
  let { writeAsync, data, isError } = useNFTFunctionwriter("listNft", [
    String(id),
    parseEther(String(price)),
  ]);
  let { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      toast("Listed Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsLoader(false);
      navigate("/BuyNFTS");
    },
  });

  // Update isOpen state when isOpenProp changes
  useEffect(() => {
    setIsOpen(isOpenProp);
  }, [isOpenProp]);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setNumber(Math.max(0, value)); // Ensure the number is not negative
    }
    console.log("id", id);
  };

  const handleClose = () => {
    onClose(false);
    setNumber(0);
  };

  async function ListNFT() {
    try {
      setIsLoader(true);
      const tx = await writeAsync?.();
      console.log("Transaction", tx?.hash);
      await axios
        .put(`https://nftproject-backend.vercel.app/nfts/updatenft/${_id}`, {
          price,
        })
        .then((result) => console.log(result.data));
      setNumber(0);
      handleClose();
    } catch (error: any) {
      console.log("Error>>", error.message);
      setNumber(0);
      toast.error("Error Listing!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center ${
        isOpen ? "" : "hidden"
      }`}
      id="modal"
    >
      <div className="bg-purple-500 rounded-lg p-8 max-w-md relative flex flex-col justify-center items-center gap-3">
        <button className="absolute top-0 right-0 p-2" onClick={handleClose}>
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black">Price of NFT</h2>
        <p className="mb-4 text-black">Add price to list NFT.</p>
        <input
          type="number"
          value={price}
          onChange={handleNumberChange}
          min="0"
          className="w-full text-black border border-solid border-gray-600 rounded-md py-2 px-4 focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={ListNFT}
          className="flex mt-4 ml-auto text-white bg-sky-400 border-0 py-2 px-6 focus:outline-none hover:bg-sky-600 rounded"
        >
          {isLoading ? "Listing..." : "List It"}
        </button>
        {isError ? (
          <p className="text-2xl text-red-500">"Error Listing"</p>
        ) : (
          ""
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      {isLoader ? (
        <ModelLoader
          type="loader"
          loaderText="Processing your request to list nft..."
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ListModal;
