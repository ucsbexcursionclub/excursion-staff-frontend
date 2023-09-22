import React from "react";
import {styled} from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, {AccordionProps} from "@mui/material/Accordion";
import MuiAccordionSummary, {AccordionSummaryProps} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({theme}) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
        borderBottom: 0
    },
    "&:before": {
        display: "none"
    }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: "0.9rem"}} />}
        {...props}
    />
))(({theme}) => ({
    backgroundColor:
        theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)"
    },
    "& .MuiAccordionSummary-content": {
        marginLeft: theme.spacing(1)
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)"
}));

export default function FAQAccordion({fontSize}) {
    const faqItems = [
        {
            question: "What is included with my membership?",
            answer: "As a member, you get access to sign up for all Excursion Club trips and have access to almost all of our gear. Trips vary in price, but all costs pay for the trip itself, not staff or overhead."
        },
        {
            question:
                "I have an idea/suggestion that might benefit the club or an activity that y'all should totally lead!",
            answer: "Wicked! We’re always looking for new ways to get rad! Please give us suggestions by DMing us on instagram @excursionclubucsb, using the contact form below, or emailing any of our staff members!"
        },
        {
            question: "I want to become a staff member! What do I have to do?",
            answer: "Being on staff for the club is a great opportunity to use and gain leadership, organizational, safety, and other skills that will make you awesome! Scroll to the bottom of our staff page for info on how to send an application!"
        },
        {
            question: "What do I do if I broke gear?",
            answer: "Don’t worry!! We’re not mad! This happens, we know. If you could just let us know how and when it happened so that we can replace the item and hopefully avoid it happening again. Use the contact form below, email info@excursionclubucsb.org or DM us on instagram @excursionclubucsb"
        },
        {
            question:
                "I recently had a great (or not so great) trip and want to give feedback! How can I do so?",
            answer: "Fill out the form below with all of the important details. We'd love to hear from you so we know what went right or wrong! If you'd like to give anonymous feedback where a Board Member is involved, contact the director directly via the Staff Page!"
        },
        {
            question: "I’m not receiving the weekly emails…What do I do?",
            answer: "First thing, please check your spam folder. If you don't find it there, fill out the form below and we'll try to figure out what's going on."
        },
        {
            question:
                "I’m having a problem with something/someone/anything to do with the club…what should I do?",
            answer: "The last thing we want is for you to not be stoked, so have no fear! We care a lot about everyone who has any involvement with the club and our activities. Please send an email using the form below and we will do our best to figure out a solution. This will go to the current board members (viewable via the staff page). If you are having an issue with one of the board members, please contact the current director via their email address."
        },
        {
            question:
                "I’m unable to attend general meetings and/or office hours and am therefore not able to register for the club…what do I do?",
            answer: "Please email us using the form below and explain your dilemma."
        },
        {
            question: "How do I contact a specific staff member?",
            answer: "If you’re looking to contact a staff member about a trip they’re leading, you can find their email address at the end of their trip listing in each weekly email. You can also find email addresses for all staffers on the Staff page."
        },
        {
            question: "Is this Adventure Programs?",
            answer: "No, while both The Excursion Club and Adventure Programs seek to bring people into the great outdoors, the Excursion Club is entirely volunteer-based. That means you only pay for the cost (if any) of the trips you go on, with no overhead, which makes our trips far cheaper. We also have a much greater variety and number of trips, ranging from just going out to surf to week-long sends in the Grand Canyon, going out each and every week!"
        },
        {
            question: "I have a friend who is not in the club, can I check out gear for them?",
            answer: "Being a member of the club offers YOU access to the club’s gear. Without membership dues, we would not be able to afford to purchase and maintain the gear we provide. Checking out gear to non-members undermines how our club works and is not allowed under any circumstances. Our club offers its gear for very low prices to begin with, please abide by this simple rule to avoid disciplinary action."
        }
    ];

    return (
        <div>
            {faqItems.map((item, index) => (
                <Accordion key={index}>
                    <AccordionSummary
                        aria-controls={`panel${index + 1}d-content`}
                        id={`panel${index + 1}d-header`}
                    >
                        <Typography style={{fontSize}}>{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography style={{fontSize}}>{item.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}
