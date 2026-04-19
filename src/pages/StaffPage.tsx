import React from "react";
import StaffGrid from "../components/StaffGrid";
import {Typography, Divider} from "@mui/material";

const StaffPage = () => {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Hero banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-md">
                <img
                    src={`${import.meta.env.EXC_CLOUDFRONT_BASE_URL}/resources/MountainHammock.png`}
                    alt="Mountain hammock"
                    className="w-full object-cover max-h-80"
                />
                <div
                    className="absolute inset-0 flex items-end justify-center pb-8"
                    style={{background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)"}}
                >
                    <Typography
                        variant="h2"
                        fontWeight={800}
                        sx={{color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.5)", letterSpacing: "-1px"}}
                        className="text-4xl sm:text-5xl md:text-6xl"
                    >
                        Our Staff
                    </Typography>
                </div>
            </div>

            {/* Intro blurb */}
            <div
                className="rounded-2xl px-6 py-6 mb-8 border border-lime-200"
                style={{background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"}}
            >
                <Typography variant="body1" sx={{color: "#166534", mb: 1, lineHeight: 1.8}}>
                    These rad people are the cogs that make the club tick! This club is 100% run by
                    volunteer staff who are dedicated to getting our members stoked — whether that
                    means running office hours, taking care of gear, or leading super sick trips!
                    If you&apos;re interested in becoming a staffer yourself, scroll down.
                </Typography>
                <Typography variant="body2" sx={{color: "#15803d", fontStyle: "italic"}}>
                    * Please do NOT contact anyone with solicitations or items unrelated to The Excursion Club.
                </Typography>
            </div>

            {/* Staff grid */}
            <StaffGrid />

            <Divider sx={{my: 8}} />

            {/* Join staff section */}
            <div
                className="rounded-2xl px-6 py-8 mb-4"
                style={{background: "linear-gradient(135deg, #1a2e05 0%, #3C4239 100%)"}}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{color: "#d9f99d", mb: 3, letterSpacing: "-0.5px"}}
                >
                    How to Join Staff
                </Typography>
                <Typography variant="body1" sx={{color: "#bbf7d0", mb: 3, lineHeight: 1.8}}>
                    Being a staffer is an experience unlike any other. Not only does it feel incredible
                    to lead awesome trips, but you will also be welcomed into a community of outdoor
                    enthusiasts with open arms while gaining valuable leadership experience. To make
                    sure you&apos;re a good fit, we ask that you tell us about yourself first — see the
                    questions below. After we&apos;ve approved your application, you&apos;ll become a
                    prospective staff member, attend staff meetings, help out on trips, and see what
                    we&apos;re all about before you take the plunge to full staff.
                </Typography>

                <ol className="space-y-2 pl-4 mb-6">
                    {[
                        "Are you already a member of the club? For how long? What sort of trips have you gone on?",
                        "What year are you?",
                        "What previous outdoor leadership experience do you possess, if any?",
                        "What sort of trips are you interested in leading?",
                        "Regarding those activities, do you feel confident in your ability to teach others how to do them safely and effectively?",
                        "Have you ever found yourself in an intense or emergency situation in the outdoors, and if so, how did you handle it?",
                        "If needed, are you willing to volunteer your time for other activities including but not limited to party planning, large trip planning, office hours, member sign-up, tabling, and staff meetings?",
                        "Give us 3 staffers who are willing to vouch for you.",
                        "The most important question: how stoked are you to join staff?"
                    ].map((q, i) => (
                        <li key={i}>
                            <Typography variant="body2" sx={{color: "#d1fae5", lineHeight: 1.7}}>
                                {q}
                            </Typography>
                        </li>
                    ))}
                </ol>

                <Typography variant="body2" sx={{color: "#86efac", lineHeight: 1.7}}>
                    Copy and paste these questions into an email to{" "}
                    <a
                        href="mailto:info@excursionclubucsb.org"
                        className="underline"
                        style={{color: "#4ade80"}}
                    >
                        info@excursionclubucsb.org
                    </a>
                    , or answer them in some creative form and send that to the same address.
                </Typography>
            </div>
        </div>
    );
};

export default StaffPage;
