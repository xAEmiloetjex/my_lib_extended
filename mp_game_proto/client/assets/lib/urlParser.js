export const url = String(window.location.href);
export const urlOrigin = String(window.location.origin);
export const urlPath = url.replace(urlOrigin, '');
export function parsePath() {
    const url_ = urlPath;
    const path = url_.split("?")[0];
    if (path === undefined)
        return "/";
    else
        return path;
}
export function parseQueries() {
    const url_ = urlPath;
    const QueryLine = url_.split("?")[1];
    if (QueryLine === undefined)
        return {};
    const queries = QueryLine.split("&");
    let keyval_store = {};
    for (const query of queries) {
        const [key, val] = query.split("=");
        keyval_store[key] = val;
    }
    return keyval_store;
}
