import Dialog from "@mui/material/Dialog";

declare module "@mui/material" {
    interface ModalComponentsPropsOverrides {
        open: boolean;
        onClose: () => void;
    }
}
