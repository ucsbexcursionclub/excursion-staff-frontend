/** @type {import('tailwindcss').Config} */
export default {
    corePlugins: {
        preflight: false
    },
    important: "#root",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            minWidth: {
                80: "320px"
            },
            width: {
                "6/10": "60%"
            },
            maxWidth: {
                "1/4": "25%"
            },
            minHeight: {
                40: "160px"
            },
            maxHeight: {
                20: "80px"
            },
            backgroundColor: {
                lime: {
                    100: "#5C625A",
                    200: "#3C4239",
                    300: "#293127"
                },
                peel: {
                    100: "#F5EDF0"
                }
            },
            borderColor: {
                lime: {
                    200: "#4c574a",
                }
            }
        }
    },
    plugins: []
};
