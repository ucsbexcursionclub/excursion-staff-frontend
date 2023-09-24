import React, {useState} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function FeedbackForm({fontSize}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Box
                    component="div"
                    sx={{
                        "& > :not(style)": {m: 1, width: "90%"} // Set width to 100% for TextField components
                    }}
                >
                    <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <TextField
                        id="feedback"
                        label="Feedback or Message"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={feedback}
                        onChange={handleFeedbackChange}
                    />
                </Box>
                <button type="submit">Submit Feedback</button>
            </form>
            <p style={{fontSize}}>
                * All fields are optional. Send an anonymous message without filling out Name or
                Email.
            </p>
        </div>
    );
}
