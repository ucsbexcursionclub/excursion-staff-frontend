import MembersNav from "../components/MembersNav";
import MembersTable from "../components/MembersTable";
import React, {useState, useEffect} from "react";
import {debounce} from "lodash";

function useDebouncedSearch(
    initialValue: string,
    delay: number
): [string, React.Dispatch<React.SetStateAction<string>>] {
    const [inputValue, setInputValue] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const debouncedSetDebouncedValue = debounce((nextValue: string) => {
            setDebouncedValue(nextValue);
        }, delay);

        debouncedSetDebouncedValue(inputValue);

        return () => {
            debouncedSetDebouncedValue.cancel();
        };
    }, [inputValue, delay]);

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
