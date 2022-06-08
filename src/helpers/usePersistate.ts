import React from "react";
import useHashParam from "use-hash-param";

function usePersistate(defaultValue: any, key: string) {
    const [value, setValue] = React.useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue;
    });
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);
    return [value, setValue];
}

function useHashPersistate(defaultValue: any, key: string) {
    const [hashValue, setHashValue] = useHashParam(key, defaultValue);
    const [value, setValue] = React.useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        let hVal: string | boolean = hashValue;
        if(hVal === "true" || hVal === "false") {
            hVal = hVal === "true";
        }
        return hVal !== '' ? hVal : (stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue);
    });
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
        setHashValue(value);
    }, [key, value]);
    return [value, setValue];
}

export default usePersistate;
export {useHashPersistate};