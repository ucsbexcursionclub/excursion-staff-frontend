import React, {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function EditProfileFormDialog({isOpen, onClose, user}) {
    const [name, setName] = useState(user.name || ""); // State for the user's name
    const [bio, setBio] = useState(user.bio || ""); // State for the user's bio
    const [profilePicUrl, setProfilePicUrl] = useState(""); // State for the profile picture URL

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleBioChange = (event) => {
        setBio(event.target.value);
    };

    const handleProfilePicUrlChange = (event) => {
        setProfilePicUrl(event.target.value);
    };

    const handleSave = () => {
        // Here, you can handle saving the updated profile information to your backend or wherever it's stored.
        // You can send an API request to update the user's profile with the new data.
        // After saving, you can close the dialog.

        // For example, you can call an updateProfile function:
        // updateProfile({ name, bio, profilePicUrl });

        // Close the dialog
        onClose();
    };

    const handleClose = () => {
        // Close the dialog without saving changes
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={handleNameChange}
                />
                <TextField
                    margin="dense"
                    id="bio"
                    label="Bio"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={bio}
                    onChange={handleBioChange}
                />
                <TextField
                    margin="dense"
                    id="profilePicUrl"
                    label="Profile Picture URL"
                    type="text"
                    fullWidth
                    value={profilePicUrl}
                    onChange={handleProfilePicUrlChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditProfileFormDialog;
