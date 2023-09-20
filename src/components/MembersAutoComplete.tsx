import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, {autocompleteClasses} from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import {useTheme, styled} from "@mui/material/styles";
import {VariableSizeList, ListChildComponentProps} from "react-window";
import Typography from "@mui/material/Typography";
import {useData} from "src/utils/DataProvider";
import {MemberProps} from "src/utils/types";

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

// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function ListboxComponent(props, ref) {
        const {children, ...other} = props;
        const itemData: React.ReactNode[] = [];
        (children as React.ReactNode[]).forEach(
            (item: React.ReactNode & {children?: React.ReactNode[]}) => {
                itemData.push(item);
                itemData.push(...(item.children || []));
            }
        );

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
    error: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
    memberVal: MemberProps;
    setMemberVal: React.Dispatch<React.SetStateAction<MemberProps | null>>;
};

export default function MembersAutoComplete({
    error,
    setError,
    memberVal,
    setMemberVal
}: MembersAutoCompleteProps) {
    const [inputValue, setInputValue] = React.useState("");

    const updateInputVal = (event, newInputValue) => {
        setError(false);
        setInputValue(newInputValue);
    };

    const {membersData} = useData();

    return (
        <Autocomplete
            id="virtualize-demo"
            sx={{width: 300}}
            value={memberVal}
            style={error ? {border: "1px solid red"} : {}}
            onChange={(event: any, newValue: MemberProps | null) => {
                setMemberVal(newValue);
            }}
            inputValue={inputValue}
            onInputChange={updateInputVal}
            disableListWrap
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
            options={membersData}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Select A Member" />}
            renderOption={(props, option, state) =>
                [props, option.name, state.index] as React.ReactNode
            }
            renderGroup={(params) => params as unknown as React.ReactNode}
        />
    );
}
