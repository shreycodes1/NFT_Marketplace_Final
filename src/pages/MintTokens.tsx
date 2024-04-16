import { useState } from "react";
import { useNFTFunctionwriterERC } from "../utils/hooks";
import { useAccount, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MintTokens = () => {
  const [amount, setAmount] = useState("");
  const { address: ownerAddress, isConnected } = useAccount();

  let { writeAsync, data, isError } = useNFTFunctionwriterERC(
    "mint",
    [ownerAddress, amount],
    parseEther(String(Number(amount) * 0.001))
  );
  let { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      toast("Minted Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });
  const mintTokens = async () => {
    console.log("Minting " + amount + " tokens...");
    try {
      const tx = await writeAsync?.();
      console.log("Transaction", tx?.hash);
      setAmount("");
    } catch (error: any) {
      console.log("Error>>", error.message);
      setAmount("");
      toast.error("Error Minting!", {
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
  };

  const handleMinting = () => {
    // Check if amount is valid
    if (amount === "" || parseFloat(amount) <= 0) {
      console.log("Invalid amount");
      toast.error("Error Minting!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    mintTokens();
  };

  return (
    <section className="section explore mb-5" id="explore">
      <div className="container">
        <p className="section-subtitle">Exclusive Tokens</p>

        <div className="title-wrapper">
          <h2 className="h2 section-title">Mint Tokens</h2>
        </div>
        {/* <div className="flex justify-center items-center h-screen"> */}
        {/* <div className="bg-purple-500 p-8 rounded-lg shadow-md w-80"> */}
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Mint tokens and enjoy shopping.
        </h2>
        <input
          type="number"
          className="w-full p-3 mb-4 border rounded-md bg-white"
          placeholder="Enter amount"
          value={amount}
          min="0"
          onChange={(e) => setAmount(e.target.value)}
        />
        {isConnected ? (
          <button
            className="btn w-full flex justify-center items-center"
            onClick={handleMinting}
          >
            {isLoading ? "Minting ...." : "Mint Tokens"}
          </button>
        ) : (
          <p className="disableBtn w-full flex justify-center items-center">
            Connect First
          </p>
        )}
        {isError ? (
          <p className="text-2xl text-red-500">Error in minting</p>
        ) : (
          ""
        )}
        {/* </div> */}
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
        {/* </div> */}
      </div>
    </section>
  );
};

export default MintTokens;
