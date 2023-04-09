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