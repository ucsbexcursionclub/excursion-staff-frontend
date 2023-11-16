import MembersNav from "../components/MembersNav";
import MembersTable from "../components/MembersTable";
import React, {useState, useCallback, useEffect} from "react";
import {debounce} from "lodash";

function useDebouncedSearch(
    initialValue: string,
    delay: number
): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [inputValue, setInputValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    const debouncedSetDebouncedValue = useCallback(
        debounce((nextValue: string) => {
            setDebouncedValue(nextValue);
        }, delay),
        [delay]
    );

    useEffect(() => {
        debouncedSetDebouncedValue(inputValue);

        return debouncedSetDebouncedValue.cancel;
    }, [inputValue, debouncedSetDebouncedValue]);

    return [debouncedValue, setInputValue];
}

export default function MembersPage() {
    const [searchParams, setSearchParams] = useDebouncedSearch("", 1000);

    return (
        <>
            <MembersNav setSearchParams={setSearchParams} />
            {<MembersTable searchParams={searchParams} />}
        </>
    );
}
