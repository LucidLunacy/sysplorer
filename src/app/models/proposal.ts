export class Proposal {
  hash: string
  name: string
  yesCount: number
  noCount: number
  abstainCount: number
  absoluteYesCount: number
  creationTime: number
  expirationTime: number
  fCachedFunding: boolean
  fCachedDelete: boolean
  fCachedEndorsed: boolean
  url: string
  address: string
  amount: number
  votePercent: number
  creationUTC: string
  expirationUTC: string
}
