import React, {useState, useEffect} from "react";
import StaffGrid from "../components/StaffGrid";
import Typography from "@mui/material/Typography";
import ImageContainer from "../components/homepage/ImageContainer";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const cardStyle = "flex flex-col items-center justify-end min-w-0 w-full";

const StaffPage = () => {
    const [smallFontSize, setSmallFontSize] = useState("18px");
    const [bigFontSize, setBigFontSize] = useState("24px");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        if (screenWidth < 720) {
            const smallCalculatedFontSize = `${(screenWidth / 40).toFixed(0)}px`;
            setSmallFontSize(smallCalculatedFontSize);
        } else {
            setSmallFontSize("18px");
        }

        const bigCalculatedFontSize = `${(screenWidth / 12).toFixed(0)}px`;
        setBigFontSize(bigCalculatedFontSize);
    }, [screenWidth]);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen">
            <ImageContainer
                imgurl={`${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/MountainHammock.png`}
                bigFontSize={bigFontSize}
                textInput="Our Staff"
            />
            <Card className={cardStyle} square>
                <CardContent className="flex flex-col text-left pr-15 pl-15">
                    <Typography variant="body2" component="div">
                        <div className={`m-16 text-${smallFontSize}`}>
                            These rad people are the cogs that make the club tick! This club is 100%
                            run by volunteer staff who are dedicated to getting our members stoked,
                            whether that means running office hours, taking care of gear or leading
                            super sick trips! If you are interested in becoming a staffer yourself,
                            scroll to the bottom of this page!
                        </div>
                        <div className={`m-18 text-${parseInt(smallFontSize) - 5}`}>
                            *Please DO NOT contact anyone with solicitations or items not related to
                            The Excursion Club.
                        </div>
                    </Typography>
                </CardContent>
            </Card>
            <Card square className={cardStyle}>
                <CardContent className="w-full">
                    <StaffGrid />
                </CardContent>
            </Card>
            <Card>
                <CardContent
                    style={{backgroundColor: "rgba(60,66,57,255)"}}
                    className="flex flex-col items-start justify-end min-w-0 text-white"
                >
                    <div style={{backgroundColor: "rgba(60,66,57,255)"}}>
                        <Typography
                            variant="h2"
                            color="white"
                            textAlign="center"
                            noWrap
                            sx={{fontSize: `${parseInt(smallFontSize) + 10}px`}}
                        >
                            How to Join Staff
                        </Typography>
                        <div className={`m-16`}>
                            Being a staffer is an experience unlike any other. Not only does it feel
                            incredible to lead awesome trips, but you will also be welcomed into a
                            community of outdoor enthusiasts with open arms while gaining valuable
                            leadership experience. To make sure you&apos;re a good fit though, we
                            ask that you tell us about yourself first *see questions below*, and
                            after we&apos;ve approved your application, you&apos;ll become a
                            prospective staff member. This means you&apos;ll attend our staff
                            meetings, help out on other staffers&apos; trips, and see what
                            we&apos;re all about before you take the plunge to full staff.
                        </div>
                        <ol>
                            <li className={`m-16`}>
                                Are you already a member of the club? For how long? What sort of
                                trips have you gone on?
                            </li>
                            <li className={`m-16`}>What year are you?</li>
                            <li className={`m-16`}>
                                What previous outdoor leadership experience do you possess if any?
                            </li>
                            <li className={`m-16`}>
                                What sort of trips are you interested in leading?
                            </li>
                            <li className={`m-16`}>
                                Regarding those activities, do you feel confident in your ability to
                                teach others how to do them safely and effectively?
                            </li>
                            <li className={`m-16`}>
                                Have you ever found yourself in an intense or emergency situation in
                                the outdoors, and if so, how did you handle it?
                            </li>
                            <li className={`m-16`}>
                                If needed, are you willing to volunteer your time for other
                                activities including but not limited to, party planning, large trip
                                planning, office hours, member sign up, tabling, and staff meetings?
                            </li>
                            <li className={`m-16`}>
                                Give us 3 staffers who are willing to vouch for you
                            </li>
                            <li className={`m-16`}>
                                The most important question: how stoked are you to join staff?
                            </li>
                        </ol>
                        <div className={`m-16`}>
                            You can copy and paste these questions into an email addressed to
                            info@excursionclubucsb.org, or you can answer them in some other
                            creative form, and then email that application to
                            info@excursionclubucsb.org.
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffPage;
