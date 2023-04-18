import nodeFetch from "node-fetch";

// If in a browser setting, use the browser's fetch, otherwise use node-fetch.
export default typeof window === "undefined" ? nodeFetch : window.fetch.bind(window)