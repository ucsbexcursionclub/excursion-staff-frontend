import React, {useEffect, useMemo, useState} from "react";
import {
    Alert,
    Autocomplete,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItem,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {useQueryClient} from "@tanstack/react-query";
import {useMembers} from "../providers/MembersProvider";
import {useReservations} from "../providers/ReservationProvider";
import {useStaff} from "../providers/StaffProvider";
import {useSnackbar} from "../providers/SnackBarProvider";
import {addTrip, updateTrip} from "../utils/api";
import {
    MemberProps,
    NewTripProps,
    StaffProps,
    TripProps,
    UpdateTripProps
} from "../utils/types";

type TripFormDialogProps = {
    open: boolean;
    onClose: () => void;
    trip?: TripProps | null;
    onSaved?: (tripId: string) => void;
};

type MemberParticipantDraft = {
    member_id: string;
    attendance_status: "planned" | "attended" | "cancelled";
    comment: string;
    added_at: number;
};

type StaffParticipantDraft = {
    staff_id: string;
    comment: string;
    added_at: number;
};

const toDateTimeInputValue = (timestamp: number | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

const fromDateTimeInputValue = (value: string) => {
    if (!value) return null;
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? null : parsed;
};

export default function TripFormDialog({open, onClose, trip, onSaved}: TripFormDialogProps) {
    const isEditMode = !!trip;
    const {membersData} = useMembers();
    const {doesMemberIdHaveOverdueReservation} = useReservations();
    const {staffData} = useStaff();
    const {addNotification} = useSnackbar();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState("");
    const [tripDate, setTripDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [memberDrafts, setMemberDrafts] = useState<MemberParticipantDraft[]>([]);
    const [staffDrafts, setStaffDrafts] = useState<StaffParticipantDraft[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!open) return;

        setTitle(trip?.title || "");
        setTripDate(toDateTimeInputValue(trip?.trip_date || null));
        setEndDate(toDateTimeInputValue(trip?.end_date || null));
        setLocation(trip?.location || "");
        setDescription(trip?.description || "");
        setMemberDrafts(
            (trip?.member_participants || []).map((participant) => ({
                member_id: participant.member_id,
                attendance_status: participant.attendance_status,
                comment: participant.comment || "",
                added_at: participant.added_at
            }))
        );
        setStaffDrafts(
            (trip?.staff_participants || []).map((participant) => ({
                staff_id: participant.staff_id,
                comment: participant.comment || "",
                added_at: participant.added_at
            }))
        );
    }, [open, trip]);

    const sortedMembers = useMemo(
        () => [...membersData].sort((a, b) => a.name.localeCompare(b.name)),
        [membersData]
    );
    const sortedStaff = useMemo(
        () =>
            [...staffData].sort((a, b) => {
                const aName = a.memberDetails?.name || a.member_id;
                const bName = b.memberDetails?.name || b.member_id;
                return aName.localeCompare(bName);
            }),
        [staffData]
    );

    const selectedMembers = useMemo(
        () =>
            memberDrafts
                .map((draft) => sortedMembers.find((member) => member._id === draft.member_id))
                .filter(Boolean) as MemberProps[],
        [memberDrafts, sortedMembers]
    );
    const selectedStaff = useMemo(
        () =>
            staffDrafts
                .map((draft) => sortedStaff.find((staff) => staff._id === draft.staff_id))
                .filter(Boolean) as StaffProps[],
        [staffDrafts, sortedStaff]
    );

    const handleMembersChange = (_event: React.SyntheticEvent, value: MemberProps[]) => {
        setMemberDrafts((currentDrafts) =>
            value.map((member) => {
                const existing = currentDrafts.find((draft) => draft.member_id === member._id);
                return (
                    existing || {
                        member_id: member._id,
                        attendance_status: "planned",
                        comment: "",
                        added_at: Date.now()
                    }
                );
            })
        );
    };

    const handleStaffChange = (_event: React.SyntheticEvent, value: StaffProps[]) => {
        setStaffDrafts((currentDrafts) =>
            value.map((staff) => {
                const existing = currentDrafts.find((draft) => draft.staff_id === staff._id);
                return (
                    existing || {
                        staff_id: staff._id,
                        comment: "",
                        added_at: Date.now()
                    }
                );
            })
        );
    };

    const updateMemberDraft = (
        memberId: string,
        updates: Partial<MemberParticipantDraft>
    ) => {
        setMemberDrafts((drafts) =>
            drafts.map((draft) =>
                draft.member_id === memberId ? {...draft, ...updates} : draft
            )
        );
    };

    const updateStaffDraft = (staffId: string, updates: Partial<StaffParticipantDraft>) => {
        setStaffDrafts((drafts) =>
            drafts.map((draft) => (draft.staff_id === staffId ? {...draft, ...updates} : draft))
        );
    };

    const getMemberWarnings = (memberId: string) => {
        const member = sortedMembers.find((item) => item._id === memberId);
        const hasOverdueGear = doesMemberIdHaveOverdueReservation(memberId);
        const isFlagged = !!member?.flagged;

        return {
            hasOverdueGear,
            isFlagged,
            messages: [
                ...(hasOverdueGear ? ["This member has overdue gear reservations."] : []),
                ...(isFlagged ? ["This member is flagged by staff."] : [])
            ]
        };
    };

    const resetAndClose = () => {
        setIsSaving(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            addNotification({message: "Trip title is required.", type: "error"});
            return;
        }

        const parsedTripDate = fromDateTimeInputValue(tripDate);
        if (!parsedTripDate) {
            addNotification({message: "Trip date is required.", type: "error"});
            return;
        }

        const parsedEndDate = fromDateTimeInputValue(endDate);
        const basePayload: NewTripProps = {
            title: title.trim(),
            trip_date: parsedTripDate,
            end_date: endDate ? parsedEndDate : null,
            location: location.trim() || null,
            description: description.trim() || null,
            member_participants: memberDrafts.map((draft) => ({
                member_id: draft.member_id,
                attendance_status: draft.attendance_status,
                comment: draft.comment.trim() || null,
                added_at: draft.added_at
            })),
            staff_participants: staffDrafts.map((draft) => ({
                staff_id: draft.staff_id,
                comment: draft.comment.trim() || null,
                added_at: draft.added_at
            }))
        };

        setIsSaving(true);
        try {
            const savedTrip = isEditMode
                ? await updateTrip(trip._id, basePayload as UpdateTripProps)
                : await addTrip(basePayload);

            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["trips"]}),
                queryClient.invalidateQueries({queryKey: ["tripDetail", savedTrip._id]}),
                queryClient.invalidateQueries({queryKey: ["memberProfile"]})
            ]);

            addNotification({
                message: isEditMode ? "Trip updated successfully." : "Trip created successfully.",
                type: "success"
            });
            onSaved?.(savedTrip._id);
            resetAndClose();
        } catch (error: any) {
            setIsSaving(false);
            addNotification({
                message: error.message || "Failed to save trip.",
                type: "error"
            });
        }
    };

    return (
        <Dialog open={open} onClose={resetAndClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditMode ? "Edit Trip" : "Create Trip"}</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3}>
                    <Stack direction={{xs: "column", md: "row"}} spacing={2}>
                        <TextField
                            label="Title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Location"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                            fullWidth
                        />
                    </Stack>

                    <Stack direction={{xs: "column", md: "row"}} spacing={2}>
                        <TextField
                            label="Trip Date"
                            type="datetime-local"
                            value={tripDate}
                            onChange={(event) => setTripDate(event.target.value)}
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            required
                        />
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                            InputLabelProps={{shrink: true}}
                            fullWidth
                        />
                    </Stack>

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        multiline
                        rows={4}
                        fullWidth
                    />

                    <Autocomplete
                        multiple
                        options={sortedMembers}
                        value={selectedMembers}
                        onChange={handleMembersChange}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderOption={(props, option) => {
                            const warnings = getMemberWarnings(option._id);
                            return (
                                <ListItem {...props} key={option._id} disableGutters>
                                    <div className="flex w-full items-center justify-between gap-2">
                                        <Typography variant="body2">{option.name}</Typography>
                                        <div className="flex gap-1">
                                            {warnings.hasOverdueGear && (
                                                <Chip
                                                    label="Overdue Gear"
                                                    color="warning"
                                                    size="small"
                                                />
                                            )}
                                            {warnings.isFlagged && (
                                                <Chip label="Flagged" color="error" size="small" />
                                            )}
                                        </div>
                                    </div>
                                </ListItem>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Member Participants" />
                        )}
                    />

                    {memberDrafts.length > 0 && (
                        <Stack spacing={2}>
                            {memberDrafts.map((draft) => {
                                const member = sortedMembers.find((item) => item._id === draft.member_id);
                                if (!member) return null;
                                const warnings = getMemberWarnings(draft.member_id);

                                return (
                                    <Card key={draft.member_id} variant="outlined">
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {member.name}
                                                </Typography>
                                                {(warnings.hasOverdueGear || warnings.isFlagged) && (
                                                    <Stack spacing={1}>
                                                        {warnings.messages.map((message) => (
                                                            <Alert
                                                                key={`${draft.member_id}-${message}`}
                                                                severity="warning"
                                                            >
                                                                {message}
                                                            </Alert>
                                                        ))}
                                                    </Stack>
                                                )}
                                                <Stack direction={{xs: "column", md: "row"}} spacing={2}>
                                                    <TextField
                                                        select
                                                        label="Attendance Status"
                                                        value={draft.attendance_status}
                                                        onChange={(event) =>
                                                            updateMemberDraft(draft.member_id, {
                                                                attendance_status: event.target
                                                                    .value as MemberParticipantDraft["attendance_status"]
                                                            })
                                                        }
                                                        fullWidth
                                                    >
                                                        <MenuItem value="planned">Planned</MenuItem>
                                                        <MenuItem value="attended">Attended</MenuItem>
                                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                                    </TextField>
                                                    <TextField
                                                        label="Participant Comment"
                                                        value={draft.comment}
                                                        onChange={(event) =>
                                                            updateMemberDraft(draft.member_id, {
                                                                comment: event.target.value
                                                            })
                                                        }
                                                        fullWidth
                                                    />
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}

                    <Autocomplete
                        multiple
                        options={sortedStaff}
                        value={selectedStaff}
                        onChange={handleStaffChange}
                        getOptionLabel={(option) => option.memberDetails?.name || option.member_id}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => <TextField {...params} label="Staff Participants" />}
                    />

                    {staffDrafts.length > 0 && (
                        <Stack spacing={2}>
                            {staffDrafts.map((draft) => {
                                const staff = sortedStaff.find((item) => item._id === draft.staff_id);
                                if (!staff) return null;

                                return (
                                    <Card key={draft.staff_id} variant="outlined">
                                        <CardContent>
                                            <Stack spacing={2}>
                                                <Typography variant="subtitle1" fontWeight={600}>
                                                    {staff.memberDetails?.name || staff.member_id}
                                                </Typography>
                                                <TextField
                                                    label="Staff Comment"
                                                    value={draft.comment}
                                                    onChange={(event) =>
                                                        updateStaffDraft(draft.staff_id, {
                                                            comment: event.target.value
                                                        })
                                                    }
                                                    fullWidth
                                                />
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={resetAndClose} disabled={isSaving}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={isSaving}>
                    {isEditMode ? "Save Changes" : "Create Trip"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
