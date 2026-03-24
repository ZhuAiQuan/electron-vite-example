// 创建独属于组件级的状态 避免维护无谓的useState

import { createContext, PropsWithChildren, useContext, useRef } from 'react'
import { createStore } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { forIn, set } from 'lodash-es'
import { useUpdateEffect } from 'ahooks'

import type { StateCreator, StoreApi } from 'zustand'

type AppProviderProps = PropsWithChildren<{
  initialValue: any
  preState?: any
}>

export type AppStoreAPIType<S> = Omit<StoreApi<S>, 'subscribe'> &
  StoreSubscribeWithSelector<S> & {
    setState: SetState<S>
  }
export type SetState<S> = (fn: (draft: S) => void) => void

type StoreSubscribeWithSelector<T> = {
  subscribe: {
    (listener: (selectedState: T, previousSelectedState: T) => void): () => void
    <U>(
      selector: (state: T) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean
        fireImmediately?: boolean
      }
    ): () => void
  }
}

export const setStoreByProps = (setState, props) => {
  setState((draft) => {
    forIn(props, (v, k) => {
      set(draft, k, v)
    })
  })
}

function CreateAppStore<S>() {
  const AppContext = createContext<
    StateCreator<S, [['zustand/subscribeWithSelector', S], ['zustand/immer', S]]> | object
  >({})

  function AppProvider({ initialValue, preState, children }: AppProviderProps) {
    const store = useRef(
      createStore(
        subscribeWithSelector(
          immer<S>((setState, getState, $store) => {
            return {
              ...initialValue(setState, getState, $store),
              setState,
              getState,
              ...preState
            }
          })
        )
      )
    )
    return <AppContext.Provider value={store.current}>{children}</AppContext.Provider>
  }

  const useAppStoreApi = () => useContext(AppContext) as AppStoreAPIType<S>
  const useUpdateAppStore = (props: Partial<S>) => {
    const { setState } = useAppStoreApi()
    useUpdateEffect(() => {
      if (props) {
        setStoreByProps(setState, props)
      }
    }, [props])

    return null
  }
  const UpdateAppStoreBy = ({ path, value }: { path: string; value: any }) => {
    const { setState } = useAppStoreApi()
    useUpdateEffect(() => {
      setState((draft: any) => {
        set(draft, path, value)
      })
    }, [path, value])
    return null
  }

  function useAppStore<T>(selector: (state: S) => T) {
    const store = useAppStoreApi()
    if (!('setState' in store)) throw new Error('组件树缺少AppProvider，请检查组件树')
    return useStoreWithEqualityFn(store, selector, shallow)
  }

  function createUseAppStore<_S = S>() {
    function useAppStoreT<T>(selector: (state: _S) => T) {
      const store = useAppStoreApi() as unknown as StoreApi<_S>
      if (!('setState' in store)) throw new Error('组件树中缺少AppProvider')
      return useStoreWithEqualityFn(store, selector, shallow)
    }

    return useAppStoreT
  }

  return {
    AppContext,
    AppProvider,
    useAppStoreApi,
    useUpdateAppStore,
    useAppStore,
    UpdateAppStoreBy,
    createUseAppStore
  }
}

export default CreateAppStore
