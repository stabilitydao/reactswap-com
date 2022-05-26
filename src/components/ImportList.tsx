import { TokenList } from '@uniswap/token-lists'
import ListLogo from '@/src/components/ListLogo'
import { useFetchListCallback } from '@/src/hooks/useFetchListCallback'
import { useCallback, useState } from 'react'
import { AlertTriangle, ArrowLeft, X } from 'react-feather'
import { useAppDispatch } from '@/src/state/store'
import { enableList, removeList } from '@/src/state/lists/actions'
import { useAllLists } from '@/src/state/lists/hooks'
import styled from 'styled-components'

import { CurrencyModalView } from './CurrencySearchModal'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`

interface ImportProps {
  listURL: string
  list: TokenList
  onDismiss: () => void
  setModalView: (view: CurrencyModalView) => void
}

export function ImportList({ listURL, list, setModalView, onDismiss }: ImportProps) {
  const dispatch = useAppDispatch()

  // user must accept
  const [confirmed, setConfirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {

        // turn list on
        dispatch(enableList(listURL))
        // go back to lists
        setModalView(CurrencyModalView.manage)
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL, setModalView])

  return (
    <Wrapper>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between">
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => setModalView(CurrencyModalView.manage)} />
          <div>
            <span>Import List</span>
          </div>
          <X onClick={onDismiss} />
        </div>
      </div>
      <br />
      <div className="flex gap-2">
        <div className="flex gap-3">
          <div className="flex bg-indigo-600 px-10 py-5">
            <div className="flex justify-between">
              <div className="flex">
                {list.logoURI && <ListLogo logoURI={list.logoURI} size="40px" />}
                <div className="flex gap-2 ml-5">
                  <div className="flex">
                    <div>
                      {list.name}
                    </div>
                    .
                    <div>
                      <span>{list.tokens.length} tokens</span>
                    </div>
                  </div>
                  <a href={`https://tokenlists.org/token-list?url=${listURL}`} target="_blank">
                    <div>
                      {listURL}
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex justify-center text-center gap-5 mb-5">
              <AlertTriangle stroke={'#ff0000'} size={32} />
              <div>
                <span>Import at your own risk</span>
              </div>
            </div>

            <div className="flex text-center gap-3 mb-3">
              <div>
                <span>
                  By adding this list you are implicitly trusting that the data is correct. Anyone can create a list,
                  including creating fake versions of existing lists and lists that claim to represent projects that do
                  not have one.
                </span>
              </div>
              <div>
                <span>If you purchase a token from this list, you may not be able to sell it back.</span>
              </div>
            </div>
            <div className="flex justify-center cursor-pointer" onClick={() => setConfirmed(!confirmed)}>
              <input
                name="confirmed"
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
              />
              <div>
                <span>I understand</span>
              </div>
            </div>
          </div>

          <button
            className="btn px-10 py-2 rounded-xl"
            disabled={!confirmed}
            onClick={handleAddList}
          >
            <span>Import</span>
          </button>
          {addError ? (
            <div>
              {addError}
            </div>
          ) : null}
        </div>
        {/* </Card> */}
      </div>
    </Wrapper>
  )
}
