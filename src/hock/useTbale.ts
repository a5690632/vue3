import { reactive } from "vue";
interface obj {
  getData: (callback: (params: params) => void) => void;
  data:
    | {
        [propName: string]: any;
      }
    | undefined;
  total: number;
}
interface params {
  current: number;
  pageSize: number;
  [propName: string]: any;
}

export default function useData(callback: () => any, params: params): obj {
  let data;
  let total = 0;
  const getData = async (callback: (params: params) => any) => {
    let res = await callback(params);
    if (res.code == "0") {
      data = res.data;
      total = res.data.total;
      params.loading = false;
    }
  };
  getData(callback);

  return {
    getData,
    data,
    total,
  };
}
