import React, {useMemo, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {addTripComment, getTripById} from "../utils/api";
import {useMembers} from "../providers/MembersProvider";
import {useReservations} from "../providers/ReservationProvider";
import {useSnackbar} from "../providers/SnackBarProvider";
import {CommentCategory, TripProps} from "../utils/types";
import CommentCategoryChip from "./CommentCategoryChip";
import TripFormDialog from "./TripFormDialog";

type TripDetailsDialogProps = {
    open: boolean;
    tripId: string | null;
    onClose: () => void;
};

const formatDateTime = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
};

const categoryOptions: CommentCategory[] = ["general", "warning", "commendation"];

export default function TripDetailsDialog({open, tripId, onClose}: TripDetailsDialogProps) {
    const {addNotification} = useSnackbar();
    const {retrieveMemberById} = useMembers();
    const {doesMemberIdHaveOverdueReservation} = useReservations();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const [commentCategory, setCommentCategory] = useState<CommentCategory>("general");
    const [targetMemberId, setTargetMemberId] = useState<string>("");
    const [isSavingComment, setIsSavingComment] = useState(false);
    const [isEditingTrip, setIsEditingTrip] = useState(false);

    const {data, isLoading, error} = useQuery({
        queryKey: ["tripDetail", tripId],
        queryFn: () => getTripById(tripId!),
        enabled: open && !!tripId
    });

    const trip = data as TripProps | undefined;
    const memberOptions = useMemo(() => trip?.member_participants || [], [trip]);
    const getMemberWarnings = (memberId: string) => {
        const member = retrieveMemberById(memberId);
        return {
            hasOverdueGear: doesMemberIdHaveOverdueReservation(memberId),
            isFlagged: !!member?.flagged
        };
    };

    const resetCommentForm = () => {
        setCommentText("");
        setCommentCategory("general");
        setTargetMemberId("");
        setIsSavingComment(false);
    };

    const handleClose = () => {
        resetCommentForm();
        setIsEditingTrip(false);
        onClose();
    };

    const handleAddComment = async () => {
        if (!tripId || !commentText.trim()) {
            addNotification({message: "Trip comment cannot be empty.", type: "error"});
            return;
        }

        setIsSavingComment(true);
        try {
            await addTripComment(tripId, {
                comment: commentText.trim(),
                category: commentCategory,
                target_member_id: targetMemberId || null
            });

            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["tripDetail", tripId]}),
                queryClient.invalidateQueries({queryKey: ["trips"]}),
                queryClient.invalidateQueries({queryKey: ["memberProfile"]})
            ]);

            addNotification({message: "Trip comment added.", type: "success"});
            resetCommentForm();
        } catch (mutationError: any) {
            setIsSavingComment(false);
            addNotification({
                message: mutationError.message || "Failed to add trip comment.",
                type: "error"
            });
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Stack
                        direction={{xs: "column", sm: "row"}}
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                {trip?.title || "Trip Details"}
                            </Typography>
                            {trip && (
                                <Typography variant="body2" color="text.secondary">
                                    {formatDateTime(trip.trip_date)}
                                </Typography>
                            )}
                        </Box>
                        {trip && (
                            <Button variant="outlined" onClick={() => setIsEditingTrip(true)}>
                                Edit Trip
                            </Button>
                        )}
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {isLoading && (
                        <Box className="flex justify-center py-8">
                            <CircularProgress />
                        </Box>
                    )}

                    {!isLoading && error && (
                        <Alert severity="error">
                            {(error as Error).message || "Failed to load trip details."}
                        </Alert>
                    )}

                    {!isLoading && !error && trip && (
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Overview
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Location: {trip.location || "N/A"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    End Date: {formatDateTime(trip.end_date)}
                                </Typography>
                                <Typography variant="body1" className="mt-2 whitespace-pre-wrap">
                                    {trip.description || "No description provided."}
                                </Typography>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    Member Participants
                                </Typography>
                                <List dense>
                                    {(trip.member_participants || []).map((participant) => (
                                        <ListItem key={participant.member_id} disableGutters>
                                            <div className="w-full">
                                                <ListItemText
                                                    primary={
                                                        participant.memberDetails?.name ||
                                                        participant.member_id
                                                    }
                                                    secondary={
                                                        <>
                                                            <span>
                                                                Status: {participant.attendance_status}
                                                            </span>
                                                            <br />
                                                            <span>
                                                                Comment: {participant.comment || "None"}
                                                            </span>
                                                        </>
                                                    }
                                                />
                                                {(getMemberWarnings(participant.member_id).hasOverdueGear ||
                                                    getMemberWarnings(participant.member_id).isFlagged) && (
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        className="mt-1 flex-wrap"
                                                    >
                                                        {getMemberWarnings(participant.member_id)
                                                            .hasOverdueGear && (
                                                            <Chip
                                                                label="Has overdue gear"
                                                                color="warning"
                                                                size="small"
                                                            />
                                                        )}
                                                        {getMemberWarnings(participant.member_id)
                                                            .isFlagged && (
                                                            <Chip
                                                                label="Flagged by staff"
                                                                color="error"
                                                                size="small"
                                                            />
                                                        )}
                                                    </Stack>
                                                )}
                                            </div>
                                        </ListItem>
                                    ))}
                                    {(trip.member_participants || []).length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No member participants.
                                        </Typography>
                                    )}
                                </List>
                            </Box>

                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    Staff Participants
                                </Typography>
                                <List dense>
                                    {(trip.staff_participants || []).map((participant) => (
                                        <ListItem key={participant.staff_id} disableGutters>
                                            <ListItemText
                                                primary={
                                                    participant.staffDetails?.memberDetails?.name ||
                                                    participant.staff_id
                                                }
                                                secondary={`Comment: ${participant.comment || "None"}`}
                                            />
                                        </ListItem>
                                    ))}
                                    {(trip.staff_participants || []).length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No staff participants.
                                        </Typography>
                                    )}
                                </List>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    Trip Comments
                                </Typography>
                                <Stack spacing={2}>
                                    {(trip.comments || []).map((comment) => (
                                        <Box
                                            key={comment._id}
                                            className="rounded-lg border border-gray-200 p-3"
                                        >
                                            <Stack
                                                direction={{xs: "column", sm: "row"}}
                                                spacing={1}
                                                justifyContent="space-between"
                                                className="mb-2"
                                            >
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <CommentCategoryChip category={comment.category} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {comment.author_name || "Unknown author"}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDateTime(comment.created_at)}
                                                </Typography>
                                            </Stack>
                                            {comment.target_member_id && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Target member:{" "}
                                                    {trip.member_participants
                                                        ?.find(
                                                            (participant) =>
                                                                participant.member_id ===
                                                                comment.target_member_id
                                                        )
                                                        ?.memberDetails?.name || comment.target_member_id}
                                                </Typography>
                                            )}
                                            <Typography variant="body2" className="whitespace-pre-wrap">
                                                {comment.comment}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {(trip.comments || []).length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No trip comments yet.
                                        </Typography>
                                    )}
                                </Stack>
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                                    Add Trip Comment
                                </Typography>
                                <Stack spacing={2}>
                                    <Stack direction={{xs: "column", md: "row"}} spacing={2}>
                                        <TextField
                                            select
                                            label="Category"
                                            value={commentCategory}
                                            onChange={(event) =>
                                                setCommentCategory(event.target.value as CommentCategory)
                                            }
                                            fullWidth
                                        >
                                            {categoryOptions.map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                        <TextField
                                            select
                                            label="Target Member"
                                            value={targetMemberId}
                                            onChange={(event) => setTargetMemberId(event.target.value)}
                                            fullWidth
                                        >
                                            <MenuItem value="">General Comment</MenuItem>
                                            {memberOptions.map((participant) => (
                                                <MenuItem
                                                    key={participant.member_id}
                                                    value={participant.member_id}
                                                >
                                                    {participant.memberDetails?.name || participant.member_id}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>
                                    <TextField
                                        label="Comment"
                                        value={commentText}
                                        onChange={(event) => setCommentText(event.target.value)}
                                        multiline
                                        rows={3}
                                        fullWidth
                                    />
                                    <Box>
                                        <Button
                                            variant="contained"
                                            onClick={handleAddComment}
                                            disabled={isSavingComment}
                                        >
                                            Add Comment
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            {trip && (
                <TripFormDialog
                    open={isEditingTrip}
                    onClose={() => setIsEditingTrip(false)}
                    trip={trip}
                    onSaved={() => {
                        setIsEditingTrip(false);
                        if (tripId) {
                            void queryClient.invalidateQueries({queryKey: ["tripDetail", tripId]});
                        }
                        void queryClient.invalidateQueries({queryKey: ["trips"]});
                        void queryClient.invalidateQueries({queryKey: ["memberProfile"]});
                    }}
                />
            )}
        </>
    );
}
