export class Offer {
  id: string;
  cert: string;
  txid: string;
  expires_on: number;
  expired: boolean;
  height: number;
  category: string[];
  title: string;
  currency: string;
  price: number;
  commission: number;
  offerlink_guid: string;
  offerlink_seller: string;
  paymentoptions: string;
  offer_units: number;
  quantity: number;
  private: boolean;
  description: { description: string, images: string[] };
  alias: string;
  address: string;
  offertype: string;
  auction_expires_on: number;
  auction_reserve_price: number;
  auction_require_witness: boolean;
  auction_deposit: number;
}
