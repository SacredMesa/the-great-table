import {useSearchParams} from "react-router-dom";
import {TableSearchParams} from "../../models/Table.ts";
import _ from "lodash";

export const useSearchParamsStateEffect = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (updateState: TableSearchParams) => {
    setSearchParams((prev) => {
      const updatedParams = {}
      for (const [param, value] of prev.entries()) {
        _.assign(updatedParams, {[param]: value})
      }
      _.assign(updatedParams, updateState)
      return updatedParams
    })
  }

  const deleteParams = (params: (keyof TableSearchParams)[]) => {
    setSearchParams((prev) => {
      for (const [param] of prev.entries()) {
        if (_.includes(params, param)) prev.delete(param)
      }
      return prev
    })
  }

  return {
    searchParams,
    updateParams,
    deleteParams
  }
}
