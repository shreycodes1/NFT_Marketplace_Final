const address = "0xCeE2561869DbcB929e521284d2BF166d67818FFD";
const ERC20address = "0x52537989D0BBa01f7f18F0Ff4A410cb7BDE37D41";
import { abi } from "../abis/0xCeE2561869DbcB929e521284d2BF166d67818FFD";
import { abi as ABI2 } from "../abis/0x52537989D0BBa01f7f18F0Ff4A410cb7BDE37D41";
import { useContractRead, useContractWrite } from "wagmi";

export function useNFTFunctionwriter(
  functionName: string,
  args?: any[]
): ReturnType<typeof useContractWrite> {
  const contractWrite = useContractWrite({
    address: address,
    abi: abi,
    functionName: functionName,
    args: args,
  });

  return contractWrite;
}

export function useNFTFunctionwriterERC(
  functionName: string,
  args?: any[],
  eth?: any
): ReturnType<typeof useContractWrite> {
  const contractWrite = useContractWrite({
    address: ERC20address,
    abi: ABI2,
    functionName: functionName,
    args: args,
    value: eth,
  });

  return contractWrite;
}
export interface UseNFTFunctionReaderProps {
  functionName: string;
  args?: String[];
}
// create a generic hook to access read functions of contract
export function useNFTFunctionReader({
  functionName,
  args, // Default to an empty array if 'args' is not provided
}: UseNFTFunctionReaderProps): ReturnType<typeof useContractRead> {
  const contractRead = useContractRead({
    address: ERC20address,
    abi: abi,
    functionName: functionName,
    args: args,
    watch: true,
  });

  return contractRead;
}
