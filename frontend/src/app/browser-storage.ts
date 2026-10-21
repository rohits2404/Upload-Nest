import type { WebStorage } from "redux-persist";

const createBrowserStorage = (): WebStorage => ({
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),

    setItem: (key, value) => {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
    },

    removeItem: (key) => {
        window.localStorage.removeItem(key);
        return Promise.resolve();
    },
});

const storage: WebStorage =
    typeof window !== "undefined"
        ? createBrowserStorage()
        : {
              getItem: () => Promise.resolve(null),
              setItem: () => Promise.resolve(),
              removeItem: () => Promise.resolve(),
          };

export default storage;
