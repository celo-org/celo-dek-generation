import Loading from "@/components/Loading";
import Account from "@celo/abis/Accounts.json";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { useState } from "react";
import { KeysProps } from "./api/generate-keys";

const TESTNET_ACCOUNT_CONTRACT = "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9";

export default function Home() {
  const [keys, setKeys] = useState<KeysProps | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-keys", {
        method: "GET",
      });
      const data = await res.json();
      setKeys(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setAccountDataEncryptionKey = async () => {
    try {
      setLoading(true);
      if (keys) {
        const provider = new JsonRpcProvider(
          "https://alfajores-forno.celo-testnet.org"
        );

        const wallet = new Wallet(`0x${keys.privateKey}`, provider);
        const contract = new Contract(
          TESTNET_ACCOUNT_CONTRACT,
          Account.abi,
          wallet
        );

        const tx = await contract.setAccountDataEncryptionKey(
          `0x${keys.dek_publicKey}`
        );
        await tx.wait();
        console.log(
          "🚀 ~ file: index.tsx:47 ~ setAccountDataEncryptionKey ~ tx:",
          tx
        );

        const publicKey = await contract.getDataEncryptionKey(keys.address);
        if (publicKey === `0x${keys.dek_publicKey}`) {
          setSuccess(true);
        }
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        id="toast-warning"
        className="flex items-center w-full max-w-xl my-3 p-4 text-gray-500 bg-white rounded-lg shadow"
        role="alert"
      >
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg">
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
          </svg>
          <span className="sr-only">Warning icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">
          <p>
            Please note that this is a testnet and the keys generated here are
            for testing purposes only.
          </p>
        </div>
      </div>
      <button
        disabled={loading}
        onClick={generateKeys}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
      >
        {loading && <Loading />}
        Generate Keys
      </button>
      {keys && (
        <div className="mt-3 flex items-center flex-col">
          <div className="w-full p-5 border-2 font-bold border-gray-600 rounded-xl text-gray-500 flex flex-col text-sm">
            <p className="mt-0.5">
              Private Key:{" "}
              <code className="mt-0.5 text-black font-bold break-normal bg-gray-300 py-0.5 px-1 rounded-md">
                0x{keys.privateKey}
              </code>
            </p>
            <p className="mt-1">
              Public Key:{" "}
              <code className="mt-0.5 text-black font-bold break-normal bg-gray-300 py-0.5 px-1 rounded-md">
                0x{keys.publicKey}
              </code>
            </p>
            <p className="mt-1">
              Address:{" "}
              <code className="mt-0.5 text-black font-bold break-normal bg-gray-300 py-0.5 px-1 rounded-md">
                {keys.address}
              </code>
            </p>
            <p className="mt-4">
              DEK Private Key:{" "}
              <code className="mt-0.5 text-black font-bold break-normal bg-gray-300 py-0.5 px-1 rounded-md">
                0x{keys.dek_privateKey}
              </code>
            </p>
            <p className="mt-1">
              DEK Public Key:{" "}
              <code className="mt-0.5 text-black font-bold break-normal bg-gray-300 py-0.5 px-1 rounded-md">
                0x{keys.dek_publicKey}
              </code>
            </p>
            <p className="mt-1">
              DEK Address:{" "}
              <code className="mt-0.5 text-black font-bold break-normal bg-gray-300 py-0.5 px-1 rounded-md">
                {keys.dek_address}
              </code>
            </p>
          </div>
          <div
            id="toast-warning"
            className="flex items-center w-full max-w-xl mt-3 p-4 text-gray-500 bg-white rounded-lg shadow"
            role="alert"
          >
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg">
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
              </svg>
              <span className="sr-only">Warning icon</span>
            </div>
            <div className="ml-3 text-sm font-normal">
              <p>
                Before going to next step, please add some Testnet Celo to{" "}
                <span className="text-black font-bold">Address</span> mentioned
                above.
              </p>
              <p>
                <a
                  href="https://faucet.celo.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center px-4 mt-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                >
                  Celo Testnet Faucet
                </a>
              </p>
            </div>
          </div>
          <button
            disabled={loading}
            onClick={setAccountDataEncryptionKey}
            type="button"
            className="text-white mt-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center"
          >
            {loading && <Loading />}
            Register DEK Key
          </button>
        </div>
      )}
      {success && (
        <div className="text-base flex flex-row space-x-3 mt-4 text-green-600 font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#16a34a"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
          Success
        </div>
      )}
    </div>
  );
}
