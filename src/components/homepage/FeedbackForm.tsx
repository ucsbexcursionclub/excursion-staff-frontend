import React, {useState, ChangeEvent, FormEvent} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Button, Typography} from "@mui/material";
import {sendFeedback} from "../../utils/api";

interface Props {
    fontSize: string;
}

export default function FeedbackForm({fontSize}: Props) {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSubject(e.target.value);
    };

    const handleFeedbackChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Set loading state while sending

        try {
            // Send feedback data to the API
            await sendFeedback({name, email, phone, subject, feedback});

            // Reset form and loading state after successful submission
            setName("");
            setEmail("");
            setPhone("");
            setSubject("");
            setFeedback("");
            setLoading(false);
        } catch (error) {
            setLoading(false); // Reset loading state on error
            console.error("Error submitting feedback:", error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Box className="flex flex-col">
                    <Typography
                        variant="body2"
                        className="pb-2"
                        style={{
                            fontSize: `${parseInt(fontSize) + 6}px`,
                            fontWeight: "bold",
                            color: "black"
                        }}
                    >
                        Contact Us
                    </Typography>
                    <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        className="pb-2"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        className="pb-2"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        id="phone"
                        label="Phone"
                        variant="outlined"
                        className="pb-2"
                        value={phone}
                        onChange={handlePhoneChange}
                    />
                    <TextField
                        id="subject"
                        label="Subject"
                        variant="outlined"
                        className="pb-2"
                        required
                        value={subject}
                        onChange={handleSubjectChange}
                    />
                    <TextField
                        id="feedback"
                        label="Feedback or Message"
                        variant="outlined"
                        className="pb-2"
                        multiline
                        required
                        rows={4}
                        value={feedback}
                        onChange={handleFeedbackChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{width: "min-content", whiteSpace: "nowrap"}}
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? "Submitting..." : "Submit Feedback"} {/* Show loading state */}
                    </Button>
                </Box>
            </form>
            <p style={{fontSize}}>
                * Send an anonymous message without filling out Name, Email, or Phone.
            </p>
        </div>
    );
}
