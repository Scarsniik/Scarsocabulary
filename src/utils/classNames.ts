export function classNames(...items: (string | undefined | false)[]): string {
    let result = ""
    for (const item of items) {
        if (result !== "") result += " ";
        if (item) result += item;
    }
    return result;
}
