import React, {ReactNode} from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, {autocompleteClasses} from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import useTheme from "@mui/material/styles/useTheme";
import styled from "@mui/material/styles/styled";

import {VariableSizeList, ListChildComponentProps} from "react-window";
import Typography from "@mui/material/Typography";
import {MemberProps} from "../utils/types";
import {useMembers} from "../providers/MembersProvider";

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
    const {data, index, style} = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING
    };

    if (Object.prototype.hasOwnProperty.call(dataSet, "group")) {
        return (
            <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
                {dataSet.group}
            </ListSubheader>
        );
    }

    return (
        <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
            {dataSet[1]}
        </Typography>
    );
}
const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

OuterElementType.displayName = "OuterElementType";

function useResetCache(data: any) {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

interface ListboxProps extends React.HTMLAttributes<HTMLElement> {
    children?: Array<React.ReactNode & {children?: React.ReactNode[]}>;
}

const ListboxComponent = React.forwardRef<HTMLDivElement, ListboxProps>(
    function ListboxComponent(props, ref) {
        const {children, ...other} = props;
        const itemData: React.ReactNode[] = [];
        children?.forEach((item) => {
            itemData.push(item);
            itemData.push(...(item.children || []));
        });

        const theme = useTheme();
        const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
            noSsr: true
        });
        const itemCount = itemData.length;
        const itemSize = smUp ? 36 : 48;

        const getChildSize = (child: React.ReactNode) => {
            if (Object.prototype.hasOwnProperty.call(child, "group")) {
                return 48;
            }

            return itemSize;
        };

        const getHeight = () => {
            if (itemCount > 8) {
                return 8 * itemSize;
            }
            return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
        };

        const gridRef = useResetCache(itemCount);

        return (
            <div ref={ref}>
                <OuterElementContext.Provider value={other}>
                    <VariableSizeList
                        itemData={itemData}
                        height={getHeight() + 2 * LISTBOX_PADDING}
                        width="100%"
                        ref={gridRef}
                        outerElementType={OuterElementType}
                        innerElementType="ul"
                        itemSize={(index) => getChildSize(itemData[index])}
                        overscanCount={5}
                        itemCount={itemCount}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    }
);

ListboxComponent.displayName = "ListboxComponent";

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0
        }
    }
});

type MembersAutoCompleteProps = {
    error?: boolean;
    setError?: React.Dispatch<React.SetStateAction<boolean>>;
    overrideLabel?: string;
    memberVal: MemberProps | undefined | null;
    setMemberVal: React.Dispatch<React.SetStateAction<MemberProps | null>>;
};

export default function MembersAutoComplete({
    error,
    setError,
    overrideLabel,
    memberVal,
    setMemberVal
}: MembersAutoCompleteProps) {
    const [inputValue, setInputValue] = React.useState("");

    const updateInputVal = (event: React.SyntheticEvent<Element, Event>, value: string) => {
        event;
        setError && setError(false);
        setInputValue(value);
    };

    const {membersData} = useMembers();

    return (
        <Autocomplete
            id="virtualize-demo"
            sx={{width: 300}}
            value={memberVal}
            style={error ? {border: "1px solid red"} : {}}
            onChange={(event: any, newValue: MemberProps | null) => {
                event;
                setMemberVal(newValue);
            }}
            inputValue={inputValue}
            onInputChange={updateInputVal}
            disableListWrap
            PopperComponent={StyledPopper}
            ListboxComponent={
                ListboxComponent as React.JSXElementConstructor<React.HTMLAttributes<HTMLElement>>
            }
            options={membersData}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
                <TextField {...params} label={overrideLabel ?? "Select A Member"} />
            )}
            renderOption={(props, option, state) => [props, option.name, state.index] as ReactNode}
            renderGroup={(params) => params as unknown as ReactNode}
        />
    );
}
