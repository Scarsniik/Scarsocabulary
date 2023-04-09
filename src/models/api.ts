export interface ApiResult<T, S> {
    status: S;
    content?: T;
}