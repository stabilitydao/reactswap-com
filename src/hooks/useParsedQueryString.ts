import { /*parse,*/ ParsedQs } from 'qs'
import { useRouter } from 'next/router'

/*export function parsedQueryString(search?: string): ParsedQs {
  if (!search && typeof window !== "undefined") {
    // react-router-dom places search string in the hash
    const hash = window.location.hash
    search = hash.substr(hash.indexOf('?'))
  }
  return search && search.length > 1 ? parse(search, { parseArrays: false, ignoreQueryPrefix: true }) : {}
}*/

export default function useParsedQueryString(): ParsedQs {
  const { query } = useRouter()
  // console.log('useParsedQueryString query', query)
  // return typeof window !== "undefined" ? query : {}
  return query
}
