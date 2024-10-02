// ExposeStoreToWindow.jsx
import { useEffect } from 'react';
import { storeContainer } from './index';
import { createStore } from 'zustand/vanilla';
type ParsexRenderStore = {
  isRender: boolean;
  setIsRender: (isRender: boolean) => void;
  containerStore: any;
  setContentStore: (store: any) => void;
  currentFile?: any;
  setCurrentFile?: (currentFile: any) => void;
};
export const renderStore = createStore<ParsexRenderStore>((set, get) => ({
  isRender: false,
  setIsRender: (isRender: boolean) => set({ isRender }),
  containerStore: {},
  setContentStore: (store) => {
    set({ containerStore: store });
  },
  currenFile: {},
  setCurrentFile: (currentFile) => {
    set({ currentFile });
  },
}));
window.renderStore = renderStore;

export const ExposeStoreToWindow = () => {
  const store = storeContainer.useContainer();

  useEffect(() => {
    // 使用 getters 确保获取最新的状态
    window.storeContainer = {
      get currentFile() {
        return store.currentFile;
      },
      setCurrentFile: store.setCurrentFile,
      get resultJson() {
        return store.resultJson;
      },
      setResultJson: store.setResultJson,
      get itemList() {
        return store.itemList;
      },
      setItemList: store.setItemList,
      get tableList() {
        return store.tableList;
      },
      setTableList: store.setTableList,
      generateCopyContent: store.generateCopyContent,
      get key() {
        return store.key;
      },
      setKey: store.setKey,
      get curUid() {
        return store.curUid;
      },
      setCurUid: store.setCurUid,
      get rectList() {
        return store.rectList;
      },
      setRectList: store.setRectList,
      get multiple() {
        return store.multiple;
      },
    };
    renderStore.getState().setIsRender(true);
    renderStore.getState().setContentStore(store);
    // 清理函数，组件卸载时移除绑定
    return () => {
      delete window.storeContainer;
      renderStore.getState().setIsRender(false);
    };
  }, [store]);
  useEffect(()=>{
    renderStore.getState().setCurrentFile(store.currentFile)
  },[store.currentFile])
  return null;
};

export default ExposeStoreToWindow;
