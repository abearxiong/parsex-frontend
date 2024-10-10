import { createContainer } from 'unstated-next';
import { ResultType } from '../data.d';
import type { IFileItem, IImgResult, IItemList, IRectListItem, KeyTypeEnum } from '../data.d';
import { useState } from 'react';
import { getItemListCopyContent } from '../utils';
import { useLocation } from 'dva';
import { renderStore } from './ExportToWindows';

interface ContentConfig {
  type?: ResultType;
  separate?: string;
  exportBase64?: boolean;
  isExport?: boolean;
}

const useStore = () => {
  const [currentFile, _setCurrentFile] = useState<IFileItem | Record<string, any>>({} as any);
  const [resultJson, setResultJson] = useState<IImgResult | null>(null);
  const setCurrentFile = (currentFile: any) => {
    _setCurrentFile(currentFile);
    renderStore.getState().setCurrentFile(currentFile);
  };
  // 识别结果
  const [itemList, setItemList] = useState<IItemList[]>([]);
  const [tableList, setTableList] = useState<IItemList[][]>();
  const [key, setKey] = useState<KeyTypeEnum>();
  // 当前选中的框选id
  const [curUid, setCurUid] = useState<any>('');
  // 框选数据
  const [rectList, setRectList] = useState<IRectListItem[]>([]);

  const { query } = useLocation() as any;
  const multiple = ['qr_code'].includes(query.service);

  const generateCopyContent = ({ separate, type }: ContentConfig) => {
    if (type === ResultType.json) {
      return JSON.stringify(resultJson);
    }
    let content = getItemListCopyContent(itemList, separate);
    tableList?.map((item) => {
      content += content ? '\n' : '';
      content += getItemListCopyContent(item, separate);
    });
    return content;
  };

  const updateCurrentFileRects = (rects: IRectListItem[]) => {
    const newCurrentFile = { ...currentFile };
    let orginalRects = newCurrentFile.rects || [];
    orginalRects = orginalRects.map((item) => {
      const rectList = item;
      if (Array.isArray(rectList)) {
        return rectList.map((rect) => {
          const rectItem = rects.find((r) => r.content_id == rect.content_id) || {};
          if(!rect?.oText) {
            rect.oText = rect?.text;
          }
          return {
            ...rect,
            ...rectItem,
          };
        });
      } else {
        const rectItem = rects.find((r) => r.content_id == rectList.content_id) || {};
        if(!rectList?.oText) {
          rectList.oText = rectList?.text;
        }
        return {
          ...rectList,
          ...rectItem,
        };
      }
    });
    newCurrentFile.rects = orginalRects;
    setCurrentFile(newCurrentFile);
  };
  return {
    currentFile,
    setCurrentFile,
    updateCurrentFileRects,
    resultJson,
    setResultJson,
    itemList,
    setItemList,
    tableList,
    setTableList,
    generateCopyContent,
    key,
    setKey,
    curUid,
    setCurUid,
    rectList,
    setRectList,
    multiple,
  };
};
export const storeContainer = createContainer(useStore);
