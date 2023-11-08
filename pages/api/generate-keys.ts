// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  MnemonicStrength,
  generateKeys,
  generateMnemonic,
} from "@celo/cryptographic-utils";
import type { NextApiRequest, NextApiResponse } from "next";

export interface KeysProps {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  address: string;
  dek_privateKey: string;
  dek_publicKey: string;
  dek_address: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const ETHEREUM_DERIVATION_PATH = "m/44'/60'/0'";

  const mnemonic = await generateMnemonic(MnemonicStrength.s256_24words);
  const { privateKey, publicKey, address } = await generateKeys(
    mnemonic,
    undefined,
    0,
    0,
    undefined,
    ETHEREUM_DERIVATION_PATH
  );
  const {
    privateKey: dek_privateKey,
    publicKey: dek_publicKey,
    address: dek_address,
  } = await generateKeys(mnemonic, undefined, 1, 0);

  const responseObj = {
    mnemonic,
    privateKey,
    publicKey,
    address,
    dek_privateKey,
    dek_publicKey,
    dek_address,
  };
  console.log(
    "🚀 ~ file: generate-keys.ts:43 ~ handler ~ responseObj:",
    responseObj
  );

  res.status(200).json(responseObj);
};

export default handler;
