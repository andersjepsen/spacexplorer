import { ParsedUrlQuery } from "querystring";

export function useQueryParam(param: ParsedUrlQuery[number]) {
  if (!param) return "";

  if (Array.isArray(param)) {
    return param[0];
  }

  return param;
}
