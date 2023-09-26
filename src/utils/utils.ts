export function capitalizeFirstLetter(str: string) {
    return str
        .split(" ") // Split string by space
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of every word
        .join(" "); // Join the words back together
}
