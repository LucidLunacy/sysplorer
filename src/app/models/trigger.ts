import { Proposal } from './proposal';

export class Trigger {
  hash: string
  fundedProposals: Proposal[]
  creationTime: number
  blockHeight: number
}
