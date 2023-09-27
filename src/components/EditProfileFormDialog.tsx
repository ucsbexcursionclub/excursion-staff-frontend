import React, {useState, ChangeEvent} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import {useLogin} from "src/providers/LoginProvider";

interface EditProfileFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileFormDialog: React.FC<EditProfileFormDialogProps> = ({isOpen, onClose}) => {
    const {user} = useLogin();

    const [name, setName] = useState<string>(user.name || "");
    const [bio, setBio] = useState<string>(user.staffDetails?.bio || "");
    const [profilePic, setProfilePic] = useState<File | null>(null);

    // Initial set to existing profile image or blank avatar
    const [profilePicPreview, setProfilePicPreview] = useState<string>(
        user.staffDetails?.profileImageUrl || "/path/to/blank/avatar.png"
    );

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleBioChange = (event: ChangeEvent<HTMLInputElement>) => {
        setBio(event.target.value);
    };

    const handleProfilePicChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        profilePic;
        // Handle the saving of the profile info, including uploading the image.
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog fullWidth maxWidth={"sm"} open={isOpen} onClose={handleClose}>
            <DialogTitle className="text-center">Edit Profile</DialogTitle>
            <DialogContent className="flex flex-col items-center">
                <Avatar
                    src={profilePicPreview}
                    className="mb-4 mt-2"
                    style={{width: 100, height: 100}}
                />
                <label htmlFor="raised-button-file" className="mb-2">
                    <Button
                        variant="contained"
                        className="border-2 rounded-2xl font-bold"
                        component="span"
                    >
                        Upload Image
                    </Button>
                </label>
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
                    helperText="Enter your bio that is to be displayed on the staff page!"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={bio}
                    onChange={handleBioChange}
                />
                <input
                    accept="image/*"
                    style={{display: "none"}}
                    id="raised-button-file"
                    type="file"
                    onChange={handleProfilePicChange}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    className="border-2"
                    color="primary"
                >
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileFormDialog;
