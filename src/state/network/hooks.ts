import { ChainId } from '../../enums/ChainId'
import { useSelector } from 'react-redux'
import { selectChainId } from './index'

export function useChainId(): ChainId {
  return useSelector(selectChainId)
}
