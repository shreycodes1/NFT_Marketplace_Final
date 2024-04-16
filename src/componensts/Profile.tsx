import { useEffect, useState } from "react";
import "../styles/profile.css";
import axios from "axios";
import { useAccount } from "wagmi";

const Profile = () => {
  const { address } = useAccount();
  const [data, setData] = useState<any>({});

  const fetchUser = async () => {
    try {
      axios
        .get(
          `https://nftproject-backend.vercel.app/users/getsingleuser/${address}`
        )
        .then((res) => {
          console.log(res);
          setData(res.data);
        });
    } catch (error) {}
  };
  useEffect(() => {
    if (address !== undefined) {
      localStorage.setItem("address", address?.toString());
      fetchUser();
    }
  }, [address]);
  return (
    <div className="flex flex-col dropDownProfile">
      <ul className="flex flex-col gap-4 ">
        <li>{data?.username}</li>
        <li>{data?.email}</li>
      </ul>
    </div>
  );
};

export default Profile;
