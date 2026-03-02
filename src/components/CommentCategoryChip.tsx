import Chip from "@mui/material/Chip";
import {CommentCategory} from "../utils/types";

type CommentCategoryChipProps = {
    category: CommentCategory;
    size?: "small" | "medium";
};

const categoryColorMap: Record<CommentCategory, "default" | "warning" | "success" | "info"> = {
    general: "info",
    warning: "warning",
    commendation: "success"
};

const formatCategory = (category: CommentCategory) =>
    category.charAt(0).toUpperCase() + category.slice(1);

export default function CommentCategoryChip({
    category,
    size = "small"
}: CommentCategoryChipProps) {
    return <Chip label={formatCategory(category)} color={categoryColorMap[category]} size={size} />;
}
