const UNI_LIST = 'https://tokens.uniswap.org'
const QUIKSWAP_LIST = 'https://unpkg.com/quickswap-default-token-list@1.2.31/build/quickswap-default.tokenlist.json'
const SUSHI_LIST = 'https://token-list.sushi.com'

export const UNSUPPORTED_LIST_URLS: string[] = []

const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  UNI_LIST,
  QUIKSWAP_LIST,
  SUSHI_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  UNI_LIST,
  QUIKSWAP_LIST,
  SUSHI_LIST,
]
