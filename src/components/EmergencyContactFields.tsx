import React from "react";
import {Autocomplete, TextField, TextFieldProps} from "@mui/material";
import {EmergencyContact} from "../utils/types";

export const RELATIONSHIP_OPTIONS = ["Parent", "Spouse", "Partner", "Sibling", "Friend", "Other"];

export const EMPTY_EMERGENCY_CONTACT: EmergencyContact = {
    name: "",
    phone_number: "",
    relationship: ""
};

export const toEmergencyContactDraft = (
    contact: EmergencyContact | null | undefined
): EmergencyContact => ({
    name: contact?.name ?? "",
    phone_number: contact?.phone_number ?? "",
    relationship: contact?.relationship ?? ""
});

// Phone numbers are intentionally not format-validated (international numbers allowed); trim only.
export const trimEmergencyContact = (contact: EmergencyContact): EmergencyContact => ({
    name: contact.name.trim(),
    phone_number: contact.phone_number.trim(),
    relationship: contact.relationship.trim()
});

export const isEmergencyContactEmpty = (contact: EmergencyContact) => {
    const trimmed = trimEmergencyContact(contact);
    return !trimmed.name && !trimmed.phone_number && !trimmed.relationship;
};

export const isEmergencyContactComplete = (contact: EmergencyContact) => {
    const trimmed = trimEmergencyContact(contact);
    return !!trimmed.name && !!trimmed.phone_number && !!trimmed.relationship;
};

export const isSameEmergencyContact = (
    a: EmergencyContact | null | undefined,
    b: EmergencyContact | null | undefined
) => {
    const x = trimEmergencyContact(toEmergencyContactDraft(a));
    const y = trimEmergencyContact(toEmergencyContactDraft(b));
    return (
        x.name === y.name && x.phone_number === y.phone_number && x.relationship === y.relationship
    );
};

type EmergencyContactFieldsProps = {
    value: EmergencyContact;
    onChange: (value: EmergencyContact) => void;
    required?: boolean;
    showErrors?: boolean;
    variant?: TextFieldProps["variant"];
    margin?: TextFieldProps["margin"];
};

const EmergencyContactFields: React.FC<EmergencyContactFieldsProps> = ({
    value,
    onChange,
    required = false,
    showErrors = false,
    variant = "standard",
    margin = "dense"
}) => {
    const fieldError = (field: keyof EmergencyContact) => {
        if (!showErrors) return false;
        const empty = !value[field].trim();
        // When optional, only flag missing fields once the contact is partially filled
        return empty && (required || !isEmergencyContactEmpty(value));
    };

    const update = (field: keyof EmergencyContact, fieldValue: string) =>
        onChange({...value, [field]: fieldValue});

    return (
        <>
            <TextField
                margin={margin}
                label="Emergency Contact Name"
                type="text"
                fullWidth
                variant={variant}
                value={value.name}
                onChange={(e) => update("name", e.target.value)}
                error={fieldError("name")}
                required={required}
            />
            <TextField
                margin={margin}
                label="Emergency Contact Phone Number"
                type="tel"
                fullWidth
                variant={variant}
                value={value.phone_number}
                onChange={(e) => update("phone_number", e.target.value)}
                error={fieldError("phone_number")}
                helperText="Any format, including international (e.g. +44 20 7946 0958)"
                required={required}
            />
            <Autocomplete
                freeSolo
                options={RELATIONSHIP_OPTIONS}
                inputValue={value.relationship}
                onInputChange={(_, newValue) => update("relationship", newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        margin={margin}
                        label="Emergency Contact Relationship"
                        fullWidth
                        variant={variant}
                        error={fieldError("relationship")}
                        required={required}
                    />
                )}
            />
        </>
    );
};

export default EmergencyContactFields;
