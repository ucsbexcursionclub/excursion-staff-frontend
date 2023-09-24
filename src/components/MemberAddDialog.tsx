import * as React from "react";
import {useQuery} from "react-query";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import {useMembers} from "src/providers/MembersProvider";
import {getMembers} from "src/utils/api";
import {MemberProps} from "src/utils/types";

interface MemberAddDialog {
    open: boolean;
    onClose: () => void;
}

function useMembersData() {
    return useQuery("members", getMembers);
}

const AddMemberDialogue: React.FC<MemberAddDialog> = ({open, onClose}) => {
    const [membershipStatus, setMembershipStatus] = React.useState("newMember"); // Default to "New Member"
    const [membershipDuration, setMembershipDuration] = React.useState("365"); // Default to 1 year
    const [stokedLevel, setStokedLevel] = React.useState(""); // Stoked level state
    const [email, setEmail] = React.useState("");
    const [reEnterEmail, setReEnterEmail] = React.useState("");
    const [emailError, setEmailError] = React.useState<string | null>(null); // Specify the type
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [phoneNumberError, setPhoneNumberError] = React.useState<string | null>(null); // Specify the type
    const [fullName, setFullName] = React.useState(""); // Full name state
    const [fullNameError, setFullNameError] = React.useState<string | null>(null);
    const [validationEnabled, setValidationEnabled] = React.useState(false); // Enable validation when the user hits submit
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [submitErrorMessage, setSubmitErrorMessage] = React.useState<string | null>(null);
    const [hasWaiver, setHasWaiver] = React.useState("no"); // Default to "Yes" for the waiver
    const [hasPaid, setHasPaid] = React.useState("no"); // Default to "Yes" for the waiver
    const [staffName, setStaffName] = React.useState("");

    const handleClose = () => {
        setValidationEnabled(false);
        setSuccessMessage(null);
        setSubmitErrorMessage(null);
        onClose();
    };
    const handleHasWaiver = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHasWaiver(event.target.value);
    };
    const handleHasPaid = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHasPaid(event.target.value);
    };
    const handleStokedLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStokedLevel(value);
    };
    const handleStaffNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setStaffName(value);
    };
    const handleMembershipStatusChange = (event) => {
        setMembershipStatus(event.target.value);
    };
    const handleMembershipDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMembershipDuration(event.target.value);
    };
    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFullName(value);
        if (validationEnabled) {
            if (!value) {
                setFullNameError("Full Name is required");
            } else {
                setFullNameError(null);
            }
        }
    };
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(value)) {
            setEmailError("Invalid email address");
        } else {
            setEmailError(null);
        }
    };
    const handleReEnterEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setReEnterEmail(value);

        if (value !== email) {
            setEmailError("Emails do not match");
        } else {
            setEmailError(null);
        }
    };
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneNumber(value);

        const phoneRegex = /^(?:\+\d{1,3}[-.\s]?)?(?:\(\d{1,4}\)[-.\s]?)?\d{10}$/;
        if (!phoneRegex.test(value)) {
            setPhoneNumberError("Invalid phone number (10 digits required)");
        } else {
            setPhoneNumberError(null);
        }
    };
    const calculatePrice = () => {
        if (membershipStatus === "newMember") {
            switch (membershipDuration) {
                case "365":
                    return "$60";
                case "180":
                    return "$50";
                case "90":
                    return "$30";
                default:
                    return "";
            }
        } else if (membershipStatus === "returningMember") {
            switch (membershipDuration) {
                case "365":
                    return "$40";
                case "180":
                    return "$30";
                case "90":
                    return "$20";
                default:
                    return "";
            }
        }
        return "";
    };

    const validateForm = () => {
        let errorMessage = "";

        if (hasWaiver === "no") {
            errorMessage = "Please fill out the waiver.";
        } else if (emailError !== null) {
            errorMessage = "Please enter a valid email.";
        } else if (reEnterEmail !== email) {
            errorMessage = "Please make sure your emails match.";
        } else if (phoneNumberError !== null) {
            errorMessage = "Please enter a valid phone number.";
        } else if (!fullName) {
            errorMessage = "Please enter your full name.";
        } else if (hasPaid === "no") {
            errorMessage = "Please ensure the new member has paid dues.";
        }

        return errorMessage;
    };

    const {handleMemberAdd} = useMembers();
    const {data: allMembersData} = useMembersData();

    const handleSubmit = async () => {
        setValidationEnabled(true);
        setSuccessMessage(null);
        setSubmitErrorMessage(null);

        try {
            const existingMembers = allMembersData || [];

            const isDuplicateFullName = existingMembers.some(
                (member) => member.name.toLowerCase() === fullName.toLowerCase()
            );

            const isDuplicateEmail = existingMembers.some(
                (member) => member.email.toLowerCase() === email.toLowerCase()
            );

            const isDuplicatePhoneNumber = existingMembers.some(
                (member) => member.phone_number === phoneNumber
            );

            if (isDuplicateFullName || isDuplicateEmail || isDuplicatePhoneNumber) {
                let duplicateType = "";
                if (isDuplicateFullName) {
                    duplicateType = "Full Name";
                } else if (isDuplicateEmail) {
                    duplicateType = "Email";
                } else if (isDuplicatePhoneNumber) {
                    duplicateType = "Phone Number";
                }

                if (duplicateType) {
                    setSubmitErrorMessage(
                        `A member with the same ${duplicateType} already exists.`
                    );
                    setErrorMessageTimeout();
                    return;
                }
            }
        } catch (error) {
            console.error("Failed to check member existence:", error);
            if (error.response && error.response.status === 400) {
                setSubmitErrorMessage("Invalid request data. Please check your input.");
            } else {
                setSubmitErrorMessage("Failed to check member existence. Please try again later.");
            }
            setErrorMessageTimeout();
            return;
        }

        let errorMessage = "";
        errorMessage = validateForm();
        if (errorMessage !== "") {
            setSubmitErrorMessage(errorMessage);
            setErrorMessageTimeout();
            return;
        }

        try {
            handleMemberAdd({
                name: fullName,
                email: email,
                phone_number: phoneNumber,
                membership_duration: parseInt(membershipDuration),
                is_new_member: membershipStatus === "newMember",
                signed_up_by: staffName
            });
        } catch (error) {
            console.error("Failed to add member:", error);
            setSubmitErrorMessage("Failed to send memberData to the database.");
            return;
        }

        setSuccessMessage(`Welcome, ${fullName}! You have successfully signed up.`);
        setErrorMessageTimeout();

        setFullName("");
        setEmail("");
        setReEnterEmail("");
        setPhoneNumber("");
        setValidationEnabled(false);
        setStokedLevel("");
        setHasWaiver("no");
        setHasPaid("no");

        function setErrorMessageTimeout() {
            setTimeout(() => {
                setSubmitErrorMessage(null);
            }, 5000); // 5000 milliseconds (5 seconds)
        }
    };
    const {retrieveMemberItem} = useMembers();
    const {handleMemberUpdate} = useMembers();

    const handleRenew = async () => {
        setValidationEnabled(true);
        setSuccessMessage(null);
        setSubmitErrorMessage(null);

        let errorMessage = "";
        errorMessage = validateForm();
        if (errorMessage !== "") {
            setSubmitErrorMessage(errorMessage);
            setErrorMessageTimeout();
            return;
        }

        const existingMembers = allMembersData || [];

        try {
            const memberWithEmail = existingMembers.find(
                (member) => member.email.toLowerCase() === email.toLowerCase()
            );

            if (!memberWithEmail) {
                throw new Error("Member not found. Please double-check email.");
            }

            const memberId = memberWithEmail._id;

            const retrievedMemberData = retrieveMemberItem(memberId);

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + parseInt(membershipDuration));

            const memberData: MemberProps = {
                _id: retrievedMemberData._id, //include id here
                name: fullName.toLowerCase(),
                phone_number: phoneNumber,
                email: email.toLowerCase(),
                membership_duration: parseInt(membershipDuration),
                is_new_member: membershipStatus === "newMember",
                signed_up_by: staffName,
                membership_expiration_date: expirationDate.getTime(),
                join_datetime: new Date().getTime(),
                notes: retrievedMemberData.notes
            };

            handleMemberUpdate(memberData);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setSubmitErrorMessage("Member not found. Please double check name and email.");
                setErrorMessageTimeout();
                console.error("Member not found for renewal:", error);
                return;
            } else {
                // Handle errors, e.g., show an error message to the user
                console.error("Failed to renew member:", error);
                setSubmitErrorMessage("Failed to renew member.");
                setErrorMessageTimeout();
                return;
            }
        }

        setSuccessMessage(`Membership renewed for ${fullName}`);
        setErrorMessageTimeout();

        // Clear the form fields on successful submission
        setFullName("");
        setEmail("");
        setReEnterEmail("");
        setPhoneNumber("");
        setValidationEnabled(false);
        setStokedLevel("");
        setHasWaiver("no");
        setHasPaid("no");

        function setErrorMessageTimeout() {
            setTimeout(() => {
                setSubmitErrorMessage(null);
            }, 5000); // 5000 milliseconds (5 seconds)
        }
    };

    return (
        <div style={{position: "relative"}}>
            {open && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                        backdropFilter: "blur(5px)" // Add blur effect
                    }}
                />
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Please fill in the following information to sign up
                    <Button
                        onClick={handleClose}
                        style={{position: "absolute", top: 0, right: 0}} // Add close button (X) at top right corner
                    >
                        X
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>Have you filled out the waiver?</DialogContentText>
                    <img
                        alt="QR Code"
                        src="http://d36olvmp8krees.cloudfront.net/resources/icons/qr-code-waiver.png"
                        style={{width: "100px", height: "100px"}}
                    />
                    <RadioGroup row name="isMember" value={hasWaiver} onChange={handleHasWaiver}>
                        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={fullName}
                        onChange={handleFullNameChange}
                        error={validationEnabled && !!fullNameError}
                        helperText={validationEnabled ? fullNameError || "" : ""}
                        required
                        aria-required="true"
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError !== null}
                        helperText={emailError || ""}
                        required
                        aria-required="true"
                    />
                    <TextField
                        margin="dense"
                        id="reEnterEmail"
                        label="Re-enter Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={reEnterEmail}
                        onChange={handleReEnterEmailChange}
                        error={emailError !== null}
                        helperText={emailError || ""}
                        required
                        aria-required="true"
                    />
                    <TextField
                        margin="dense"
                        id="phoneNumber"
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        variant="standard"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        error={!!phoneNumberError}
                        helperText={phoneNumberError || ""}
                        required
                        aria-required="true"
                    />
                    <TextField
                        margin="dense"
                        id="stokedLevel"
                        label="How Stoked Are You?"
                        type="text"
                        onChange={handleStokedLevelChange}
                        fullWidth
                        variant="standard"
                        value={stokedLevel}
                    />

                    <FormControl component="fieldset" style={{marginTop: "16px"}}>
                        <FormLabel>Membership Status</FormLabel>
                        <RadioGroup
                            row
                            name="membershipStatus"
                            value={membershipStatus}
                            onChange={handleMembershipStatusChange}
                        >
                            <FormControlLabel
                                value="newMember"
                                control={<Radio />}
                                label="New Member"
                            />
                            <FormControlLabel
                                value="returningMember"
                                control={<Radio />}
                                label="Returning Member"
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset">
                        <FormLabel style={{marginBottom: "8px"}}>Membership Duration</FormLabel>
                        <RadioGroup
                            row
                            name="membershipDuration"
                            value={membershipDuration}
                            onChange={handleMembershipDurationChange}
                        >
                            <FormControlLabel value="90" control={<Radio />} label="90 days" />
                            <FormControlLabel value="180" control={<Radio />} label="180 days" />
                            <FormControlLabel value="365" control={<Radio />} label="365 days" />
                        </RadioGroup>
                    </FormControl>
                    <Box sx={{my: 2, border: "1px solid black", p: 2}}>
                        <DialogContentText style={{color: "black"}}>
                            For Staff Use Only:
                        </DialogContentText>
                        <TextField
                            margin="dense"
                            id="staffer"
                            label="Staff Name"
                            type="text"
                            value={staffName}
                            onChange={handleStaffNameChange}
                            fullWidth
                            variant="standard"
                            required
                            aria-required="true"
                        />
                        <div>
                            <p>Has this member paid you {calculatePrice()}?</p>
                            <RadioGroup row name="hasPaid" value={hasPaid} onChange={handleHasPaid}>
                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="no" control={<Radio />} label="No" />
                            </RadioGroup>
                        </div>
                    </Box>
                    {submitErrorMessage && (
                        <Alert severity="error" sx={{mt: 2}}>
                            {submitErrorMessage}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert severity="success" sx={{mt: 2}}>
                            {successMessage}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRenew}>Renew</Button>
                    <Button onClick={handleSubmit}>Sign Up</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AddMemberDialogue;
