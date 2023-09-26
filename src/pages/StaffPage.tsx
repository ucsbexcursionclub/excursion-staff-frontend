import React, {useState, useEffect} from "react";
import StaffGrid from "src/components/StaffGrid";
// import {StaffMemberProps} from "src/utils/types";
import Typography from "@mui/material/Typography";
import ImageContainer from "components/homepage/ImageContainer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const generateFakeStaffMembers = (count) => {
    const positions = [
        "Director",
        "Treasurer",
        "General Board",
        "Web Developer",
        "General Staff",
        "Prospective Staff"
    ];

    const fakeStaffMembers = [];
    for (let i = 0; i < count; i++) {
        const randomPositionIndex = Math.floor(Math.random() * positions.length);
        const randomPosition = positions[randomPositionIndex];

        const fakeStaffMember = {
            _id: `staff_${i}`,
            name: `Staff Member ${i}`,
            email: `staff${i}@example.com`,
            phone_number: `555-555-555${i}`,
            is_new_member: i % 2 === 0, // Just an example of boolean value
            membership_expiration_date: Date.now() + i * 10000000, // Example date
            membership_duration: i + 1,
            join_datetime: Date.now() - i * 10000000, // Example date
            signed_up_by: `Admin ${i}`,
            notes: `Some notes about Staff Member ${i}`,
            staff_details: {
                _id: `staff_details_${i}`,
                member_id: `staff_${i}`,
                profileImageUrl: `https://example.com/profile_${i}.jpg`,
                bio: `Bio of Staff Member ${i}`,
                positions: [randomPosition]
            }
        };
        fakeStaffMembers.push(fakeStaffMember);
    }
    return fakeStaffMembers;
};

// Sample user data
const staffMembers = generateFakeStaffMembers(10); // Generate 10 fake staff members

const pageContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start", // Align items to the top
    minHeight: "100vh",
    margin: 0,
    backgroundColor: "rgba(60,66,57,255)"
};

const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column", // Display in a row layout
    alignItems: "center", // Align items at the top
    justifyContent: "flex-end", // Align the left column to the right
    minWidth: 275,
    width: "100%"
};

const greenCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column", // Display in a row layout
    alignItems: "flex-start", // Align items at the top
    justifyContent: "flex-end", // Align the left column to the right
    minWidth: 275,
    backgroundColor: "rgba(60,66,57,255)",
    color: "white"
};

const StaffPage: React.FC = () => {
    const [smallFontSize, setSmallFontSize] = useState("18px");
    const [bigFontSize, setBigFontSize] = useState("24px");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [columns, setColumns] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        // Check if the screenWidth is less than 720
        if (screenWidth < 720) {
            const smallCalculatedFontSize = `${(screenWidth / 40).toFixed(0)}px`;
            setSmallFontSize(smallCalculatedFontSize);
        } else {
            // Set a fixed font size when screenWidth is 720 or greater
            setSmallFontSize("18px");
        }

        // Check if the screenWidth is less than 720
        const bigCalculatedFontSize = `${(screenWidth / 12).toFixed(0)}px`;
        setBigFontSize(bigCalculatedFontSize);

        if (screenWidth <= 600) {
            setColumns(2);
        } else if (screenWidth <= 800) {
            setColumns(3);
        } else {
            setColumns(4);
        }
    }, [screenWidth]);

    const paragraphStyle = {
        margin: "16px",
        fontSize: smallFontSize
    };

    const asteriskNoteStyle = {
        margin: "18px",
        fontSize: `${parseInt(smallFontSize) - 5}px`
    };

    return (
        <div style={pageContainerStyle}>
            <ImageContainer
                imgurl="https://d36olvmp8krees.cloudfront.net/resources/MountainHammock.png"
                bigFontSize={bigFontSize}
                textInput="Our Staff"
            />
            <Card sx={cardStyle} square>
                <CardContent
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "left",
                        paddingRight: "15px",
                        paddingLeft: "15px"
                    }}
                >
                    <Typography variant="body2">
                        {/* <Typography
                            variant="body2"
                            style={{
                                fontSize: `${parseInt(smallFontSize) + 5}px`,
                                fontWeight: "bold",
                                color: "black",
                                paddingRight: "15px",
                                paddingLeft: "15px"
                            }}
                        ></Typography> */}
                        <p style={paragraphStyle}>
                            These rad people are the cogs that make the club tick! This club is 100%
                            run by volunteer staff who are dedicated to getting our members stoked,
                            whether that means running office hours, taking care of gear or leading
                            super sick trips! If you are interested in becoming a staffer yourself,
                            scroll to the bottom of this page!
                        </p>
                        <p style={asteriskNoteStyle}>
                            *Please DO NOT contact anyone with solicitations or items not related to
                            The Excursion Club.
                        </p>
                    </Typography>
                </CardContent>
            </Card>
            <Card square style={cardStyle}>
                <CardContent>
                    <StaffGrid numColumns={columns} staff={staffMembers} />
                </CardContent>
            </Card>
            <Card>
                <CardContent style={greenCardStyle}>
                    <Typography
                        variant="h2"
                        color="white"
                        textAlign="center"
                        noWrap
                        sx={{fontSize: `${parseInt(smallFontSize) + 10}px`}}
                    >
                        How to Join Staff
                    </Typography>
                    <p style={paragraphStyle}>
                        Being a staffer is an experience unlike any other. Not only does it feel
                        incredible to lead awesome trips, but you will also be welcomed into a
                        community of outdoor enthusiasts with open arms while gaining valuable
                        leadership experience. To make sure you&apos;re a good fit though, we ask
                        that you tell us about yourself first *see questions below*, and after
                        we&apos;ve approved your application, you&apos;ll become a prospective staff
                        member. This means you&apos;ll attend our staff meetings, help out on other
                        staffers&apos; trips, and see what we&apos;re all about before you take the
                        plunge to full staff.
                    </p>
                    <ol>
                        <li style={paragraphStyle}>
                            Are you already a member of the club? For how long? What sort of trips
                            have you gone on?
                        </li>
                        <li style={paragraphStyle}>What year are you?</li>
                        <li style={paragraphStyle}>
                            What previous outdoor leadership experience do you possess if any?
                            &lsquono worries if you don&apos;t&rsquo
                        </li>
                        <li style={paragraphStyle}>
                            What sort of trips are you interested in leading?
                        </li>
                        <li style={paragraphStyle}>
                            Regarding those activities, do you feel confident in your ability to
                            teach others how to do them safely and effectively?
                        </li>
                        <li style={paragraphStyle}>
                            Have you ever found yourself in an intense or emergency situation in the
                            outdoors, and if so, how did you handle it?
                        </li>
                        <li style={paragraphStyle}>
                            If needed, are you willing to volunteer your time for other activities
                            including but not limited to, party planning, large trip planning,
                            office hours, member sign up, tabling, and staff meetings?
                        </li>
                        <li style={paragraphStyle}>
                            Give us 3 staffers who are willing to vouch for you
                        </li>
                        <li style={paragraphStyle}>
                            The most important question: how stoked are you to join staff?
                        </li>
                    </ol>
                    <p style={paragraphStyle}>
                        You can copy and paste these questions into an email addressed to
                        info@excursionclubucsb.org, or you can answer them in some other creative
                        form, and then email that application to info@excursionclubucsb.org.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffPage;
