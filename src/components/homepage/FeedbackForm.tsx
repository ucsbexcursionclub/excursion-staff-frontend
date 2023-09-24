import React, {useState, ChangeEvent, FormEvent} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {Button, Typography} from "@mui/material";

interface Props {
    fontSize: string;
}

export default function FeedbackForm({fontSize}: Props) {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleFeedbackChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission
        console.log("Name:", name);
        console.log("Email:", email);
        console.log("Feedback:", feedback);
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
                        id="feedback"
                        label="Feedback or Message"
                        variant="outlined"
                        className="pb-2"
                        multiline
                        rows={4}
                        value={feedback}
                        onChange={handleFeedbackChange}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{width: "min-content", whiteSpace: "nowrap"}}
                    >
                        Submit Feedback
                    </Button>
                </Box>
            </form>
            <p style={{fontSize}}>
                * All fields are optional. Send an anonymous message without filling out Name or
                Email.
            </p>
        </div>
    );
}
