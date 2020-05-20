/***************************************************
 * Created by nanyuantingfeng on 2019/11/26 21:59. *
 ***************************************************/
export interface IQueryParamOrder {
  value: string
  order: 'ASC' | 'DESC'
}

export interface IQueryParamLimit {
  start: number
  count: number
}

export interface IQueryParams {
  orderBy?: Array<IQueryParamOrder>
  limit?: IQueryParamLimit
  dims?: string
  filterBy?: string
  select?: string
}
