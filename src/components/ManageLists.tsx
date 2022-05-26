import { TokenList, Version } from '@uniswap/token-lists'
import { UNSUPPORTED_LIST_URLS } from '@/src/constants/lists'
import useActiveWeb3React from '@/src/hooks/useActiveWeb3React'
import uriToHttp from '@/src/utils/uriToHttp'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle, Settings } from 'react-feather'
import { usePopper } from 'react-popper'
import { useAppDispatch, useAppSelector } from '@/src/state/store'
import styled from 'styled-components'

import { useFetchListCallback } from '@/src/hooks/useFetchListCallback'
import { useOnClickOutside } from '@/src/hooks/useOnClickOutside'
import useToggle from '@/src/hooks/useToggle'
import { acceptListUpdate, disableList, enableList, removeList } from '@/src/state/lists/actions'
import { useActiveListUrls, useAllLists, useIsListActive } from '@/src/state/lists/hooks'
import ListLogo from './ListLogo'
import ListToggle from './ListToggle'
import { CurrencyModalView } from './CurrencySearchModal'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: hidden;
`

const UnpaddedLinkStyledButton = styled.button`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text2};
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`

const StyledTitleText = styled.div<{ active: boolean }>`
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`

const StyledListUrlText = styled.span<{ active: boolean }>`
  font-size: 12px;
  color: ${({ theme, active }) => (active ? theme.white : theme.text2)};
`

const RowWrapper = styled.div<{ bgColor: string; active: boolean; hasActiveTokens: boolean }>`
  background-color: ${({ bgColor, active, theme }) => (active ? bgColor ?? 'transparent' : theme.bg2)};
  opacity: ${({ hasActiveTokens }) => (hasActiveTokens ? 1 : 0.4)};
  transition: 200ms;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 1rem;
  border-radius: 20px;
`

export const ButtonEmpty = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
  const { chainId } = useActiveWeb3React()
  const listsByUrl = useAppSelector((state) => state.lists.byUrl)
  const dispatch = useAppDispatch()
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  const activeTokensOnThisChain = useMemo(() => {
    if (!list || !chainId) {
      return 0
    }
    return list.tokens.reduce((acc, cur) => (cur.chainId === chainId ? acc + 1 : acc), 0)
  }, [chainId, list])

  // const listColor = useListColor(list?.logoURI)
  const isActive = useIsListActive(listUrl)

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }],
  })

  useOnClickOutside(node, open ? toggle : undefined)

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return
    dispatch(acceptListUpdate(listUrl))
  }, [dispatch, listUrl, pending])

  const handleRemoveList = useCallback(() => {
    if (window.prompt(`Please confirm you would like to remove this list by typing REMOVE`) === `REMOVE`) {
      dispatch(removeList(listUrl))
    }
  }, [dispatch, listUrl])

  const handleEnableList = useCallback(() => {
    dispatch(enableList(listUrl))
  }, [dispatch, listUrl])

  const handleDisableList = useCallback(() => {
    dispatch(disableList(listUrl))
  }, [dispatch, listUrl])

  if (!list) return null

  function listVersionLabel(version: Version): string {
    return `v${version.major}.${version.minor}.${version.patch}`
  }

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <RowWrapper
      active={isActive}
      hasActiveTokens={activeTokensOnThisChain > 0}
      bgColor={'#111ad1'/*listColor*/}
      key={listUrl}
      id={listUrlRowHTMLId(listUrl)}
    >
      {list.logoURI ? (
        <ListLogo style={{ width: 40, height: 40, marginRight: '1rem' }} logoURI={list.logoURI} alt={`${list.name} list logo`} />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <div className="flex flex-col" style={{ flex: '1' }}>
        <div className="flex">
          <StyledTitleText active={isActive}>{list.name}</StyledTitleText>
        </div>
        <div className="mt-2 flex w-fit justify-between">
          <StyledListUrlText active={isActive}>
            <span>{activeTokensOnThisChain} tokens</span>
          </StyledListUrlText>
          <StyledMenu ref={node as any}>
            <ButtonEmpty onClick={toggle}
                         ref={setReferenceElement as any}
                         className='ml-5'>
              <Settings stroke={isActive ? '#00ffe1' : '#8c0000'} size={20} />
            </ButtonEmpty>
            {open && (
              <PopoverContainer className="bg-indigo-800" show={true} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
                <div>{list && listVersionLabel(list.version)}</div>
                <br />
                <a href={`https://tokenlists.org/token-list?url=${listUrl}`} target="_blank">
                  <span>View list</span>
                </a>
                <button className="btn" onClick={handleRemoveList} disabled={Object.keys(listsByUrl).length === 1}>
                  <span>Remove list</span>
                </button>
                {pending && (
                  <button className="btn" onClick={handleAcceptListUpdate}>
                    <span>Update list</span>
                  </button>
                )}
              </PopoverContainer>
            )}
          </StyledMenu>
        </div>
      </div>
      <ListToggle
        isActive={isActive}
        bgColor={'#00ff22'/*listColor*/}
        toggle={() => {
          isActive ? handleDisableList() : handleEnableList()
        }}
      />
    </RowWrapper>
  )
})

const ListContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow: auto;
  flex: 1;
`

export function ManageLists({
  setModalView,
  setImportList,
  setListUrl,
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const { chainId } = useActiveWeb3React()

  const [listUrlInput, setListUrlInput] = useState<string>('')

  const lists = useAllLists()

  const tokenCountByListName = useMemo<Record<string, number>>(
    () =>
      Object.values(lists).reduce((acc, { current: list }) => {
        if (!list) {
          return acc
        }
        return {
          ...acc,
          [list.name]: list.tokens.reduce((count: number, token) => (token.chainId === chainId ? count + 1 : count), 0),
        }
      }, {}),
    [chainId, lists]
  )

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls()

  const handleInput = useCallback((e) => {
    setListUrlInput(e.target.value)
  }, [])

  const fetchList = useFetchListCallback()

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0
  }, [listUrlInput])

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter((listUrl) => {
        // only show loaded lists, hide unsupported lists
        return Boolean(lists[listUrl].current) && !Boolean(UNSUPPORTED_LIST_URLS.includes(listUrl))
      })
      .sort((listUrlA, listUrlB) => {
        const { current: listA } = lists[listUrlA]
        const { current: listB } = lists[listUrlB]

        // first filter on active lists
        if (activeListUrls?.includes(listUrlA) && !activeListUrls?.includes(listUrlB)) {
          return -1
        }
        if (!activeListUrls?.includes(listUrlA) && activeListUrls?.includes(listUrlB)) {
          return 1
        }

        if (listA && listB) {
          if (tokenCountByListName[listA.name] > tokenCountByListName[listB.name]) {
            return -1
          }
          if (tokenCountByListName[listA.name] < tokenCountByListName[listB.name]) {
            return 1
          }
          return listA.name.toLowerCase() < listB.name.toLowerCase()
            ? -1
            : listA.name.toLowerCase() === listB.name.toLowerCase()
            ? 0
            : 1
        }
        if (listA) return -1
        if (listB) return 1
        return 0
      })
  }, [lists, activeListUrls, tokenCountByListName])

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>()
  const [addError, setAddError] = useState<string | undefined>()

  useEffect(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then((list) => setTempList(list))
        .catch(() => setAddError(`Error importing lis`))
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList()
    } else {
      setTempList(undefined)
      listUrlInput !== '' && setAddError(`Enter valid list location`)
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined)
    }
  }, [fetchList, listUrlInput, validUrl])

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput)

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return
    setImportList(tempList)
    setModalView(CurrencyModalView.importList)
    setListUrl(listUrlInput)
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList])

  return (
    <Wrapper>
      <div className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            id="list-add-input"
            placeholder={`https:// or ipfs:// or ENS name`}
            value={listUrlInput}
            onChange={handleInput}
          />
        </div>
        {addError ? (
          <span className="text-red-300" title={addError} style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {addError}
          </span>
        ) : null}
      </div>
      {tempList && (
        <div className="flex flex-col">
          <div className="bg-indigo-600 py-4 px-8">
            <div className="flex justify-between">
              <div className="flex">
                {tempList.logoURI && <ListLogo logoURI={tempList.logoURI} size="40px" />}
                <div className="flex gap-2 ml-8">
                  <div className="font-bold">{tempList.name}</div>
                  <div>
                    <span>{tempList.tokens.length} tokens</span>
                  </div>
                </div>
              </div>
              {isImported ? (
                <div>
                  <span>
                    <CheckCircle />
                  </span>
                  <span>
                    <span>Loaded</span>
                  </span>
                </div>
              ) : (
                <button
                  className="btn px-4 py-2 text-lg "
                  onClick={handleImport}
                >
                  <span>Import</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <br />
      <ListContainer>
        <div className="flex gap-2">
          {sortedLists.map((listUrl) => (
            <ListRow key={listUrl} listUrl={listUrl} />
          ))}
        </div>
      </ListContainer>
    </Wrapper>
  )
}
