import React, {useMemo, useState} from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Link as RouterLink, useParams} from "react-router-dom";
import {
    addMemberProfileComment,
    getMemberProfile,
    updateMemberProfileComment
} from "../utils/api";
import {useLogin} from "../providers/LoginProvider";
import {useSnackbar} from "../providers/SnackBarProvider";
import {
    CommentCategory,
    MemberProfileComment,
    MemberProfileResponse,
    TripProps
} from "../utils/types";
import CommentCategoryChip from "../components/CommentCategoryChip";

const categoryOptions: CommentCategory[] = ["general", "warning", "commendation"];

const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
};

const readableGearList = (gearItems: Array<{_id: string; gear_name: string; rfid: number | null}>) => {
    return gearItems
        .map((gear) => `${gear.gear_name}${gear.rfid !== null ? ` (RFID: ${gear.rfid})` : ""}`)
        .join(", ");
};

export default function MemberProfilePage() {
    const {memberId} = useParams();
    const {isAdmin} = useLogin();
    const {addNotification} = useSnackbar();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const [commentCategory, setCommentCategory] = useState<CommentCategory>("general");
    const [editingComment, setEditingComment] = useState<MemberProfileComment | null>(null);
    const [isSavingComment, setIsSavingComment] = useState(false);

    const {data, isLoading, error} = useQuery({
        queryKey: ["memberProfile", memberId],
        queryFn: () => getMemberProfile(memberId!),
        enabled: !!memberId
    });

    const profile = data as MemberProfileResponse | undefined;
    const tripHistory = useMemo(
        () =>
            [...(profile?.trip_history || [])].sort((a, b) => (b.trip_date || 0) - (a.trip_date || 0)),
        [profile?.trip_history]
    );
    const overdueRentals = useMemo(
        () =>
            (profile?.rental_history || []).filter(
                (rental) =>
                    rental.due_date < Date.now() &&
                    (rental.checked_out_gear_details || []).length > 0
            ),
        [profile?.rental_history]
    );

    const resetCommentForm = () => {
        setCommentText("");
        setCommentCategory("general");
        setEditingComment(null);
        setIsSavingComment(false);
    };

    const handleEditComment = (comment: MemberProfileComment) => {
        setEditingComment(comment);
        setCommentText(comment.comment);
        setCommentCategory(comment.category);
    };

    const handleSubmitComment = async () => {
        if (!memberId || !commentText.trim()) {
            addNotification({message: "Profile comment cannot be empty.", type: "error"});
            return;
        }

        setIsSavingComment(true);
        try {
            if (editingComment) {
                await updateMemberProfileComment(memberId, editingComment._id, {
                    comment: commentText.trim(),
                    category: commentCategory
                });
            } else {
                await addMemberProfileComment(memberId, {
                    comment: commentText.trim(),
                    category: commentCategory
                });
            }

            await queryClient.invalidateQueries({queryKey: ["memberProfile", memberId]});
            addNotification({
                message: editingComment ? "Profile comment updated." : "Profile comment added.",
                type: "success"
            });
            resetCommentForm();
        } catch (mutationError: any) {
            setIsSavingComment(false);
            addNotification({
                message: mutationError.message || "Failed to save profile comment.",
                type: "error"
            });
        }
    };

    const renderTripCard = (trip: TripProps) => {
        const participant = (trip.member_participants || []).find(
            (item) => item.member_id === profile?.member._id
        );
        const targetedComments = (trip.comments || []).filter(
            (comment) => comment.target_member_id === profile?.member._id
        );

        return (
            <Card key={trip._id} variant="outlined">
                <CardContent>
                    <Stack spacing={1.5}>
                        <Stack
                            direction={{xs: "column", md: "row"}}
                            justifyContent="space-between"
                            spacing={1}
                        >
                            <div>
                                <Typography variant="h6">{trip.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(trip.trip_date)}
                                </Typography>
                            </div>
                            <Typography variant="body2" color="text.secondary">
                                {trip.location || "Location TBD"}
                            </Typography>
                        </Stack>

                        <Typography variant="body2">
                            Attendance: {participant?.attendance_status || "Unknown"}
                        </Typography>

                        {participant?.comment && (
                            <Box className="rounded-lg bg-gray-50 p-3">
                                <Typography variant="subtitle2">Participant Comment</Typography>
                                <Typography variant="body2" className="whitespace-pre-wrap">
                                    {participant.comment}
                                </Typography>
                            </Box>
                        )}

                        {targetedComments.length > 0 && (
                            <Stack spacing={1}>
                                <Typography variant="subtitle2">Targeted Trip Comments</Typography>
                                {targetedComments.map((comment) => (
                                    <Box
                                        key={comment._id}
                                        className="rounded-lg border border-gray-200 p-3"
                                    >
                                        <Stack
                                            direction={{xs: "column", sm: "row"}}
                                            justifyContent="space-between"
                                            spacing={1}
                                            className="mb-2"
                                        >
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <CommentCategoryChip category={comment.category} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {comment.author_name || "Unknown author"}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(comment.created_at)}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" className="whitespace-pre-wrap">
                                            {comment.comment}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="mx-auto w-full max-w-6xl p-4">
            <Box className="mb-4">
                <Button component={RouterLink} to="/members" variant="outlined">
                    Back to Members
                </Button>
            </Box>

            {isLoading && (
                <Box className="flex justify-center py-12">
                    <CircularProgress />
                </Box>
            )}

            {!isLoading && error && (
                <Alert severity="error">
                    {(error as Error).message || "Failed to load member profile."}
                </Alert>
            )}

            {!isLoading && !error && profile && (
                <Stack spacing={3}>
                    <Card>
                        <CardContent>
                            <Stack spacing={2}>
                                <Typography variant="h4">{profile.member.name}</Typography>
                                <Stack direction={{xs: "column", md: "row"}} spacing={3} flexWrap="wrap">
                                    <Typography variant="body1">
                                        Email: {profile.member.email}
                                    </Typography>
                                    <Typography variant="body1">
                                        Phone: {profile.member.phone_number || "N/A"}
                                    </Typography>
                                    <Typography variant="body1">
                                        Address:{" "}
                                        {isAdmin
                                            ? profile.member.local_living_address || "N/A"
                                            : "Board access only"}
                                    </Typography>
                                </Stack>
                                <Stack direction={{xs: "column", md: "row"}} spacing={3} flexWrap="wrap">
                                    <Typography variant="body2" color="text.secondary">
                                        Join Date: {formatDate(profile.member.join_datetime)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Expiration Date:{" "}
                                        {formatDate(profile.member.membership_expiration_date)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        New Member: {profile.member.is_new_member ? "Yes" : "No"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Membership Duration: {profile.member.membership_duration} days
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {profile.member.notes && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    General Notes
                                </Typography>
                                <Typography variant="body2" className="whitespace-pre-wrap">
                                    {profile.member.notes}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    {profile.staff_profile && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Staff Profile
                                </Typography>
                                <Typography variant="body2">
                                    Positions: {profile.staff_profile.positions.join(", ") || "N/A"}
                                </Typography>
                                <Typography variant="body2" className="mt-2 whitespace-pre-wrap">
                                    {profile.staff_profile.bio || "No staff bio provided."}
                                </Typography>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardContent>
                            <Stack spacing={3}>
                                <div>
                                    <Typography variant="h6">Profile Comments</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Internal member notes with category tracking.
                                    </Typography>
                                </div>

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
                                            label={editingComment ? "Edit Comment" : "New Comment"}
                                            value={commentText}
                                            onChange={(event) => setCommentText(event.target.value)}
                                            multiline
                                            rows={3}
                                            fullWidth
                                        />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSubmitComment}
                                            disabled={isSavingComment}
                                        >
                                            {editingComment ? "Save Comment" : "Add Comment"}
                                        </Button>
                                        {editingComment && (
                                            <Button variant="outlined" onClick={resetCommentForm}>
                                                Cancel Edit
                                            </Button>
                                        )}
                                    </Stack>
                                </Stack>

                                <Divider />

                                <Stack spacing={2}>
                                    {(profile.member.profile_comments || []).map((comment) => (
                                        <Box
                                            key={comment._id}
                                            className="rounded-lg border border-gray-200 p-3"
                                        >
                                            <Stack
                                                direction={{xs: "column", sm: "row"}}
                                                justifyContent="space-between"
                                                spacing={1}
                                                className="mb-2"
                                            >
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <CommentCategoryChip category={comment.category} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {comment.author_name || "Unknown author"}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(comment.updated_at)}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" className="whitespace-pre-wrap">
                                                {comment.comment}
                                            </Typography>
                                            <Box className="mt-3">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleEditComment(comment)}
                                                >
                                                    Edit
                                                </Button>
                                            </Box>
                                        </Box>
                                    ))}
                                    {(profile.member.profile_comments || []).length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No profile comments yet.
                                        </Typography>
                                    )}
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Overdue Gear
                            </Typography>
                            <Stack spacing={2}>
                                {overdueRentals.map((rental) => (
                                    <Box
                                        key={rental._id}
                                        className="rounded-lg border border-gray-200 p-3"
                                    >
                                        <Typography variant="subtitle2">
                                            Due: {formatDate(rental.due_date)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Last Contacted: {formatDate(rental.last_contacted)}
                                        </Typography>
                                        <Typography variant="body2" className="mt-2">
                                            Gear:{" "}
                                            {readableGearList(rental.checked_out_gear_details || [])}
                                        </Typography>
                                    </Box>
                                ))}
                                {overdueRentals.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        No overdue gear found.
                                    </Typography>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Trip History
                            </Typography>
                            <Stack spacing={2}>
                                {tripHistory.map(renderTripCard)}
                                {tripHistory.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        No trip history found.
                                    </Typography>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            )}
        </div>
    );
}
