/** @type {import('tailwindcss').Config} */
module.exports = {
    corePlugins: {
        preflight: false
    },
    important: "#root",
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            minWidth: {
                80: "320px",
            },
            maxWidth: {
              "1/4": "25%"
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
            }
        }
    },
    plugins: []
};
