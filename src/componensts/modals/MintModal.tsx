import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageUploader from "../../utils/ImageUploadIpfs";
import metaData from "../../utils/MetaDataUpload";
import { useAccount, useWaitForTransaction } from "wagmi";
import { Link } from "react-router-dom";
import { useNFTFunctionwriter } from "../../utils/hooks";
import axios from "axios";
import { abi } from "../../abis/0xCeE2561869DbcB929e521284d2BF166d67818FFD";
import { ethers } from "ethers";

interface DataObject {
  trait_type: string;
  value: string;
}
interface MintModalProps {
  selectedImage: File | null | undefined;
  getNftDetails: {
    title: string;
    description: string;
  };
  isFormValid: boolean;
  attributes: any;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<File | null | undefined>
  >;
  setData: React.Dispatch<React.SetStateAction<DataObject[]>>;
  setNftDetails: React.Dispatch<
    React.SetStateAction<{ title: string; description: string }>
  >;
}

export const MintModal: React.FC<MintModalProps> = ({
  getNftDetails,
  selectedImage,
  isFormValid,
  setNftDetails,
  setSelectedImage,
  attributes,
  setData,
}: MintModalProps) => {
  const [ipfsHash, setIpfshash] = useState("");
  const { address: ownerAddress, isConnected } = useAccount();
  const [showModal, setShowModal] = useState(false);
  const [MetadataStatus, setMetadataStatus] = useState(false);
  const [ImageStatus, setImageStatus] = useState(false);
  const [Mintstatus, setMintstatus] = useState(false);
  const [tokenUri, setTokenUri] = useState<string>("");

  let { writeAsync, data, isError, reset } = useNFTFunctionwriter(
    "createToken",
    [ownerAddress, tokenUri]
  );

  const provider = new ethers.AlchemyProvider(
    "sepolia",
    import.meta.env.VITE_Alchemy
  );
  // Assuming a specific type for the result, change 'SpecificType' to the actual type.
  async function fetchData() {
    const address = "0xCeE2561869DbcB929e521284d2BF166d67818FFD";
    const contract = new ethers.Contract(address, abi, provider);
    const data = await contract._tokenIds();
    return String(data);
  }

  let { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      let tokenId = await fetchData();
      let title = getNftDetails.title;
      let description = getNftDetails.description;
      let txHash = data?.hash;

      console.log(
        title,
        description,
        tokenId,
        ownerAddress,
        attributes,
        ipfsHash,
        txHash
      );
      await axios
        .post("https://nftproject-backend.vercel.app/nfts/createnft", {
          title,
          description,
          ipfsHash,
          ownerAddress,
          tokenId,
          attributes,
          txHash,
        })
        .then((result) => console.log(result));
      console.log("Function on success completed");
      setData([]);
      setNftDetails({ title: "", description: "" });
      toast("Mint Successfully!", {
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

  // function get() {
  //   setTitle("Title");
  //   console.log(title);
  // }

  async function mintNft() {
    console.log("called");
    try {
      const tx = await writeAsync?.();
      console.log("Transaction", tx?.hash);
    } catch (error: any) {
      console.log("Error >>>", error.message);
      setMintstatus(false);
    }
  }

  const handleUpload = async () => {
    console.log(selectedImage, getNftDetails);
    const uploadImages = await ImageUploader(
      selectedImage,
      getNftDetails.title
    );
    console.log(uploadImages?.status);
    if (uploadImages?.status === 200) {
      setImageStatus(true);
    }
    setIpfshash(uploadImages?.IpfshashImage);
    const metadatares = await metaData(
      getNftDetails.title,
      getNftDetails.description,
      uploadImages?.IpfshashImage,
      attributes
    );
    console.log(metadatares?.status);
    if (metadatares?.status === 200) {
      setMetadataStatus(true);
    }
    let TokenUri = `https://ipfs.io/ipfs/${metadatares?.IpfsHash}`;
    setTokenUri(TokenUri);
  };

  function cancelAll() {
    isError = false;
    reset();
    setShowModal(false);
    setTokenUri("");
    setMintstatus(false);
    setMetadataStatus(false);
    setImageStatus(false);
    setSelectedImage(null);
    setData([]);
    setNftDetails({ title: "", description: "" });
  }
  useEffect(() => {
    if (isSuccess) {
      setMintstatus(true);
      isSuccess = false;
      console.log(data, "Data");
      // Set a timeout to close the modal after 5 seconds
      const modalTimeout = setTimeout(() => {
        setShowModal(false);
        setTokenUri("");
        setMintstatus(false);
        setMetadataStatus(false);
        setImageStatus(false);
        setSelectedImage(null);
      }, 3000);
      console.log(modalTimeout);
      console.log(getNftDetails);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (tokenUri !== "" && Mintstatus === false) {
      // Call mintNft when tokenUri is not empty and mint status is false
      mintNft();
    }
  }, [tokenUri, Mintstatus]);

  return (
    <React.Fragment>
      {/* <button onClick={() => fetchData()}>Fetch</button> */}
      {isConnected ? (
        <button
          disabled={!isFormValid || showModal}
          className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-200"
          type="button"
          onClick={() => {
            setShowModal(true);
            handleUpload();
          }}
        >
          Mint NFT
        </button>
      ) : (
        <></>
      )}
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div>
              {/*content*/}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-[#4628dc] p-10 shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-center rounded-t border-b border-solid border-slate-200 p-5">
                  <h3 className="text-3xl font-semibold">Minting Process</h3>
                </div>
                {/*body*/}
                <div className="flex flex-col mt-10">
                  <div className="flex flex-row items-center justify-center">
                    {ImageStatus ? (
                      <>
                        {" "}
                        <div className="flex flex-row items-center justify-center">
                          <img src="svgtick.svg" className="h-8" />
                          <p className="focus:outline-nonefont-medium  mr-2 inline-flex items-center rounded px-5 py-2.5 text-center text-sm text-green-400 hover:cursor-default">
                            Success
                          </p>
                        </div>
                        <div>Image Uploaded!.</div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row items-center justify-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="mr-3 inline h-4 w-4 animate-spin text-white"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            ></path>
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <p className="focus:outline-nonefont-medium  mr-2 inline-flex items-center rounded px-5 py-2.5 text-center text-sm text-black hover:cursor-default text-[1.5rem]">
                            Loading...
                          </p>
                        </div>
                        <div>Uploading Image</div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-row items-center justify-center">
                    {MetadataStatus ? (
                      <>
                        {" "}
                        <div className="flex flex-row items-center justify-center">
                          <img src="svgtick.svg" className="h-8" />
                          <p className="focus:outline-nonefont-medium  mr-2 inline-flex items-center rounded px-5 py-2.5 text-center text-sm text-green-400 hover:cursor-default text-[1.3rem]">
                            Success
                          </p>
                        </div>
                        <div>Uploading MetaData</div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row items-center justify-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="mr-3 inline h-4 w-4 animate-spin text-white"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            ></path>
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <p className="focus:outline-nonefont-medium  mr-2 inline-flex items-center rounded px-5 py-2.5 text-center text-sm text-black hover:cursor-default text-[1.5rem]">
                            Loading...
                          </p>
                        </div>
                        <div>Metadata Uploaded!. </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-center">
                    {isError ? (
                      <>
                        <div className="flex flex-row items-center justify-center">
                          <img src="cancel.svg" className="h-8" />
                          <p className="focus:outline-nonefont-medium  mr-2 inline-flex items-center rounded px-5 py-2.5 text-center text-sm text-red-400 hover:cursor-default text-[1.5rem]">
                            Erro on Transaction
                          </p>
                        </div>
                        <div>
                          "Something went wrong sorry for inconvenience!"
                        </div>
                      </>
                    ) : Mintstatus ? (
                      <>
                        {" "}
                        <div className="flex flex-row items-center justify-center">
                          <img src="svgtick.svg" className="h-8" />
                          <p className="focus:outline-nonefont-medium  mr-2 inline-flex items-center rounded px-5 py-2.5 text-center text-sm text-green-400 hover:cursor-default">
                            Success
                          </p>
                        </div>
                        <div>Transaction Confirm Check Your NFT!.</div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-row items-center justify-center">
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="mr-3 inline h-4 w-4 animate-spin text-white"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            ></path>
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            ></path>
                          </svg>
                          <p className="focus:outline-nonefont-medium  mr-2 inline-flex items-center rounded px-5 py-2.5 text-center text-sm text-black hover:cursor-default text-[1.5rem]">
                            Loading...
                          </p>
                        </div>
                        <div>Minting NFT for You Wait!.</div>
                      </>
                    )}
                  </div>

                  {Mintstatus && MetadataStatus && ImageStatus && (
                    <div className="flex items-center justify-center">
                      <Link
                        to={`/MyNfts/${ownerAddress}`}
                        className="text-blue-300 underline"
                      >
                        Go to My NFT
                      </Link>
                    </div>
                  )}
                  {isError && (
                    <div className="flex items-center justify-center">
                      <button
                        className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-200 disabled:bg-slate-200"
                        onClick={cancelAll}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
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
    </React.Fragment>
  );
};
