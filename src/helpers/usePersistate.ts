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

function parseHashVal(hashValue: string): string | boolean {
    let hVal: string | boolean = hashValue;
    if(hVal === "true" || hVal === "false") {
        hVal = hVal === "true";
    }
    return hVal;
}

function useHashPersistate(defaultValue: any, key: string) {
    const [hashValue, setHashValue] = useHashParam(key, defaultValue);
    const [value, setValue] = React.useState(() => {
        const stickyValue = window.localStorage.getItem(key);
        const hVal = parseHashVal(hashValue);
        return hVal !== '' ? hVal : (stickyValue !== null
            ? JSON.parse(stickyValue)
            : defaultValue);
    });
    React.useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
        setHashValue(value);
    }, [key, value]);
    React.useEffect(() => {
        const hVal = parseHashVal(hashValue);
        if(hVal !== value) {
            setValue(hVal);
        }
    }, [hashValue]);
    return [value, setValue];
}

export default usePersistate;
export {useHashPersistate};