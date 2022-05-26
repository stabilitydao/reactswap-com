const UNI_LIST = 'https://tokens.uniswap.org'

export const UNSUPPORTED_LIST_URLS: string[] = []

const DEFAULT_LIST_OF_LISTS_TO_DISPLAY: string[] = [
  UNI_LIST,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DEFAULT_LIST_OF_LISTS_TO_DISPLAY,
  ...UNSUPPORTED_LIST_URLS, // need to load dynamic unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST,]
