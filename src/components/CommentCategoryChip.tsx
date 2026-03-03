import React from "react";
import Chip from "@mui/material/Chip";
import {CommentCategory} from "../utils/types";
import {formatCommentCategoryLabel} from "../utils/utils";

type CommentCategoryChipProps = {
    category: CommentCategory;
    size?: "small" | "medium";
};

const categoryColorMap: Record<CommentCategory, "default" | "warning" | "success" | "info"> = {
    general: "info",
    warning: "warning",
    commendation: "success"
};

export default function CommentCategoryChip({
    category,
    size = "small"
}: CommentCategoryChipProps) {
    return (
        <Chip
            label={formatCommentCategoryLabel(category)}
            color={categoryColorMap[category]}
            size={size}
        />
    );
}
