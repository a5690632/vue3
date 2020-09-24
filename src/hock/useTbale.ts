import { reactive } from "vue";
interface data {
  getData: (url: string) => void;
}

export default function useData(url: string): data {
  const getData = (url) => {};
  return {
    getData,
  };
}
