import React from "react";
import StaffGrid from "../components/StaffGrid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const cardStyle = "flex flex-col items-center justify-end min-w-[275px] w-full";

const StaffPage = () => {
    return (
        <div
            className={
                "max-w-7xl mx-auto flex flex-col items-center justify-start min-h-screen bg-[#3C4239]"
            }
        >
            {" "}
            <div className="relative">
                {/* Main image at the top of the page */}
                <img
                    src={`${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/MountainHammock.png`}
                    alt="Homepage"
                    className="w-full"
                />

                {/* Text on main image */}
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center py-2">
                    <div className="font-bold text-center text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
                        {"Our Staff"}
                    </div>
                </div>
            </div>
            <Card className={cardStyle} square>
                <CardContent className="flex flex-col text-left pr-15 pl-15">
                    <Typography variant="body2" component="div">
                        <div className={"text-sm sm:text-base md:text-lg"}>
                            These rad people are the cogs that make the club tick! This club is 100%
                            run by volunteer staff who are dedicated to getting our members stoked,
                            whether that means running office hours, taking care of gear or leading
                            super sick trips! If you are interested in becoming a staffer yourself,
                            scroll to the bottom of this page!
                        </div>
                        <div className={"text-sm sm:text-base md:text-lg"}>
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
                            variant="body2"
                            className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white"
                        >
                            How to Join Staff
                        </Typography>
                        <div className={"text-sm sm:text-base md:text-lg"}>
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
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                Are you already a member of the club? For how long? What sort of
                                trips have you gone on?
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                What year are you?
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                What previous outdoor leadership experience do you possess if any?
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                What sort of trips are you interested in leading?
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                Regarding those activities, do you feel confident in your ability to
                                teach others how to do them safely and effectively?
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                Have you ever found yourself in an intense or emergency situation in
                                the outdoors, and if so, how did you handle it?
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                If needed, are you willing to volunteer your time for other
                                activities including but not limited to, party planning, large trip
                                planning, office hours, member sign up, tabling, and staff meetings?
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                Give us 3 staffers who are willing to vouch for you
                            </li>
                            <li className={"text-sm sm:text-base md:text-lg"}>
                                The most important question: how stoked are you to join staff?
                            </li>
                        </ol>
                        <div className={"text-sm sm:text-base md:text-lg"}>
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
