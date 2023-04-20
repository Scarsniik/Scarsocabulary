import { routes } from "src/routes";

export function getQueryParams<T>(): T {
    const searchParams = new URLSearchParams(window.location.search);
    const queryParams: any = {};
    searchParams.forEach((value, key) => {
        // Convertir la valeur en nombre si c'est possible, sinon la laisser telle quelle
        queryParams[key] = isNaN(Number(value)) ? value : Number(value);
    });
    return queryParams as T;
}

export function createQuerryParams<T = any>(params: T): string {
    let result = "";
    for (const key of Object.keys(params as any)) {
        if ((params as any)[key]) {
            if (result !== "") {
                result += "&";
            }
            result += `${key}=${(params as any)[key]}`;
        }
    }
    return result;
}

export function getRoute(name: string) {
    return routes.find((r) => r.name === name);
}

export function getUrl(name: string, params?: {[name: string]: string | number}): string {
    if (!getRoute(name)?.path) return "/";
    const path: string = getRoute(name)!.path as string;
    if (params && path) {
        for (const param of Object.keys(params)) {
            path.replace(`:${param}`, params[param].toString())
        }
    }
    return path;
}