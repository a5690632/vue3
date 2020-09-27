import { reactive, toRefs, Ref } from "vue";
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { message } from "ant-design-vue";

interface requestConfig<T> extends AxiosRequestConfig {
  method: Method;
  onSuccess?: (data: response<T>) => void;
  onFail?: (data: response<T>) => void;
}

interface response<T> {
  code: string;
  data: T;
  message: string;
}
interface requestParam {
  [propName: string]: any;
}

interface ReturnResult<T> {
  loading: Ref<boolean>;
  data: Ref<T>;
}
interface requestState<T> {
  loading: boolean;
  data: T;
}

function request<T>(
  url: string,
  config: requestConfig<T> = {
    method: "POST",
  },
  param?: requestParam
): ReturnResult<T> {
  let _onSuccess = config.onSuccess;
  let _onFail = config.onFail;
  let method = config.method;
  const state: requestState<T> = {
    loading: false,
    data: {},
  } as requestState<T>;

  const isGetMethod = method.toLowerCase() === "get";
  let ajax = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,
    timeout: 60000,
  });
  // request interceptor
  ajax.interceptors.request.use(
    (config) => {
      // if (getToken()) {
      //   config.headers["token"] = getToken();
      // }
      return config;
    },
    (error) => {
      console.log(error); // for debug
      return Promise.reject(error);
    }
  );

  // response interceptor
  ajax.interceptors.response.use(
    (response) => {
      const res = response.data;

      if (res.code !== 10000) {
        // Message({
        //   message: res.message || "Error",
        //   type: "error",
        //   duration: 5 * 1000,
        // });

        //20001 Token不存在，请重新登录 20002 Token无效，请重新登录
        if (res.code === 20001 || res.code === 20002) {
          // to re-login
          // Message.confirm("请重新登陆", "提示", {
          //   confirmButtonText: "确定",
          //   closeOnClickModal: false,
          //   showCancelButton: false,
          //   type: "warning",
          // }).then(() => {
          //   // store.dispatch("user/resetToken").then(() => {
          //   //   location.reload();
          //   // });
          // });
        }
        return Promise.reject(new Error(res.message || "Error"));
      } else {
        return res.data;
      }
    },
    (error) => {
      // Message({
      //   message: error.message,
      //   type: "error",
      //   duration: 5 * 1000,
      // });
      return Promise.reject(error);
    }
  );

  ajax({
    url,
    params: isGetMethod ? param : undefined,
    data: isGetMethod ? undefined : param,
    ...config,
  }).then((res: AxiosResponse<response<T>>) => {
    const result = res.data;
    if (result.code === "200") {
      state.data = result.data;
      if (typeof _onSuccess === "function") {
        _onSuccess(result);
      }
    } else {
      message.error(result.message);
    }
    state.loading = false;
  });

  return { ...toRefs(state) };
}
