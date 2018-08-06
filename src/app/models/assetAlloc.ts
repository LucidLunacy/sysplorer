import { AssAllocInputs } from './assAllocInputs';

export class AssetAlloc {
  _id: string;
  asset: string;
  symbol: string;
  interest_rate: number;
  txid: string;
  height: number;
  alias: string;
  balance: number;
  interest_claim_height: number;
  memo: string;
  inputs: { start: number, end: number}[];
  accumulated_interest: number
}
