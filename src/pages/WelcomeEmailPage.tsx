import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Alert,
    AppBar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Stack,
    Tab,
    Tabs,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import TitleIcon from "@mui/icons-material/Title";
import NotesIcon from "@mui/icons-material/Notes";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getWelcomeEmailSettings,
    resetWelcomeEmailSettings,
    saveWelcomeEmailSettings,
    sendTestWelcomeEmail
} from "../utils/api";
import {WelcomeEmailSettings} from "../utils/types";
import {useSnackbar} from "../providers/SnackBarProvider";
import {useMembers} from "../providers/MembersProvider";
import {useBoardAccess} from "../providers/useBoardAccess";
import UnauthorizedPage from "./UnauthorizedPage";

type EditorTab = "visual" | "html" | "preview";

const PLACEHOLDER_HELP: Record<string, string> = {
    first_name: "Member's first name",
    name: "Member's full name",
    email: "Member's email address",
    logo_url: "Club logo image URL"
};

const fillPlaceholders = (template: string, values: Record<string, string>) =>
    template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) => values[key] ?? match);

// The logo is stored as {{logo_url}}; show the real image while editing, then swap it back
const toEditable = (html: string, logoUrl: string) => html.split("{{logo_url}}").join(logoUrl);
const fromEditable = (html: string, logoUrl: string) =>
    logoUrl ? html.split(logoUrl).join("{{logo_url}}") : html;

const toolbarCommands: Array<{
    label: string;
    icon: React.ReactNode;
    command: string;
    value?: string;
}> = [
    {label: "Bold", icon: <FormatBoldIcon />, command: "bold"},
    {label: "Italic", icon: <FormatItalicIcon />, command: "italic"},
    {label: "Underline", icon: <FormatUnderlinedIcon />, command: "underline"},
    {label: "Heading", icon: <TitleIcon />, command: "formatBlock", value: "h3"},
    {label: "Normal text", icon: <NotesIcon />, command: "formatBlock", value: "p"},
    {label: "Bulleted list", icon: <FormatListBulletedIcon />, command: "insertUnorderedList"},
    {label: "Numbered list", icon: <FormatListNumberedIcon />, command: "insertOrderedList"},
    {label: "Remove link", icon: <LinkOffIcon />, command: "unlink"},
    {label: "Undo", icon: <UndoIcon />, command: "undo"},
    {label: "Redo", icon: <RedoIcon />, command: "redo"}
];

export default function WelcomeEmailPage() {
    const {isBoardMember, isLoading: isCheckingAccess} = useBoardAccess();

    if (isCheckingAccess) {
        return (
            <Box className="flex justify-center py-16">
                <CircularProgress />
            </Box>
        );
    }
    if (!isBoardMember) return <UnauthorizedPage />;
    return <WelcomeEmailEditor />;
}

function WelcomeEmailEditor() {
    const queryClient = useQueryClient();
    const {addNotification} = useSnackbar();
    const {loggedInMember} = useMembers();

    const {data, isLoading, error} = useQuery({
        queryKey: ["welcomeEmailSettings"],
        queryFn: getWelcomeEmailSettings,
        refetchOnWindowFocus: false
    });

    const [subject, setSubject] = useState("");
    const [html, setHtml] = useState("");
    const [tab, setTab] = useState<EditorTab>("visual");
    // Bumped to reload the visual editor from `html` (on load, reset, or leaving the HTML tab)
    const [visualVersion, setVisualVersion] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const logoUrl = data?.logo_url ?? "";
    const isDirty = !!data && (subject !== data.subject || html !== data.html);

    const applySettings = useCallback((settings: WelcomeEmailSettings) => {
        setSubject(settings.subject);
        setHtml(settings.html);
        setVisualVersion((v) => v + 1);
    }, []);

    useEffect(() => {
        if (data) applySettings(data);
    }, [data, applySettings]);

    // Warn before leaving the page with unsaved edits
    useEffect(() => {
        if (!isDirty) return;
        const handler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    // Only recomputed when the visual editor is (re)loaded, so typing doesn't reset the cursor
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const visualSrcDoc = useMemo(() => toEditable(html, logoUrl), [visualVersion, logoUrl]);

    const syncFromVisual = useCallback(() => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc?.documentElement) return;
        setHtml(fromEditable(doc.documentElement.outerHTML, logoUrl));
    }, [logoUrl]);

    const handleVisualLoad = () => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return;
        doc.designMode = "on";
        doc.addEventListener("input", syncFromVisual);
    };

    const runCommand = (command: string, value?: string) => {
        const doc = iframeRef.current?.contentDocument;
        if (!doc) return;
        iframeRef.current?.contentWindow?.focus();
        doc.execCommand(command, false, value);
        syncFromVisual();
    };

    const handleAddLink = () => {
        const url = window.prompt("Link address (e.g. https://excursionclubucsb.org)");
        if (url) runCommand("createLink", url.trim());
    };

    const handleTabChange = (_: React.SyntheticEvent, next: EditorTab) => {
        if (next === "visual") setVisualVersion((v) => v + 1);
        setTab(next);
    };

    const previewValues = useMemo(() => {
        const fullName = loggedInMember?.name || "Alex Gaucho";
        return {
            first_name: fullName.trim().split(/\s+/)[0],
            name: fullName,
            email: loggedInMember?.email || "member@ucsb.edu",
            logo_url: logoUrl
        };
    }, [loggedInMember, logoUrl]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const saved = await saveWelcomeEmailSettings({subject, html});
            queryClient.setQueryData(["welcomeEmailSettings"], saved);
            addNotification({
                type: "success",
                message: "Welcome email saved. New members will get this version."
            });
        } catch (saveError: any) {
            addNotification({type: "error", message: saveError.message});
        } finally {
            setIsSaving(false);
        }
    };

    const handleDiscard = () => {
        if (data && window.confirm("Discard your unsaved changes?")) applySettings(data);
    };

    const handleReset = async () => {
        if (
            !window.confirm(
                "Reset the welcome email to the original built-in version? Your custom version will be deleted."
            )
        ) {
            return;
        }
        setIsSaving(true);
        try {
            const reset = await resetWelcomeEmailSettings();
            queryClient.setQueryData(["welcomeEmailSettings"], reset);
            addNotification({type: "success", message: "Welcome email reset to the default."});
        } catch (resetError: any) {
            addNotification({type: "error", message: resetError.message});
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendTest = async () => {
        setIsSendingTest(true);
        try {
            const sentTo = await sendTestWelcomeEmail({subject, html});
            addNotification({type: "success", message: `Test email sent to ${sentTo}.`});
        } catch (testError: any) {
            addNotification({type: "error", message: testError.message});
        } finally {
            setIsSendingTest(false);
        }
    };

    const copyPlaceholder = async (key: string) => {
        const token = `{{${key}}}`;
        try {
            await navigator.clipboard.writeText(token);
            addNotification({
                type: "info",
                message: `Copied ${token}. Paste it where you want it in the email.`
            });
        } catch {
            addNotification({type: "info", message: `Type ${token} where you want it.`});
        }
    };

    const status = data?.is_default
        ? "Using the built-in default email"
        : data?.updated_at
          ? `Last saved ${new Date(data.updated_at).toLocaleString()}${
                data.updated_by_name ? ` by ${data.updated_by_name}` : ""
            }`
          : "Custom email";

    return (
        <>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    background: "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
                    borderBottom: "1px solid #c7d2fe"
                }}
            >
                <Toolbar className="flex flex-col items-start py-3">
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{color: "#1e1b4b", letterSpacing: "-0.5px"}}
                    >
                        Welcome Email
                    </Typography>
                    <Typography variant="body2" sx={{color: "#4338ca"}}>
                        Sent automatically to every new member right after they sign up.
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box className="p-4 max-w-6xl mx-auto">
                {isLoading && (
                    <Box className="flex justify-center py-16">
                        <CircularProgress />
                    </Box>
                )}
                {error && <Alert severity="error">{(error as Error).message}</Alert>}

                {data && (
                    <Stack spacing={2}>
                        <Stack
                            direction={{xs: "column", sm: "row"}}
                            justifyContent="space-between"
                            alignItems={{xs: "flex-start", sm: "center"}}
                            spacing={1}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                    size="small"
                                    label={data.is_default ? "Default" : "Customized"}
                                    color={data.is_default ? "default" : "primary"}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {status}
                                </Typography>
                                {isDirty && (
                                    <Chip size="small" color="warning" label="Unsaved changes" />
                                )}
                            </Stack>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Button
                                    variant="outlined"
                                    onClick={handleSendTest}
                                    disabled={isSendingTest || isSaving}
                                >
                                    {isSendingTest ? "Sending..." : "Send test to me"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleDiscard}
                                    disabled={!isDirty || isSaving}
                                >
                                    Discard changes
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                    disabled={!isDirty || isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save"}
                                </Button>
                            </Stack>
                        </Stack>

                        <TextField
                            label="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            fullWidth
                        />

                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                Placeholders are filled in for each member when the email is sent.
                                Click one to copy it:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {data.placeholders.map((key) => (
                                    <Tooltip key={key} title={PLACEHOLDER_HELP[key] || key}>
                                        <Chip
                                            label={`{{${key}}}`}
                                            onClick={() => copyPlaceholder(key)}
                                            variant="outlined"
                                            sx={{fontFamily: "monospace"}}
                                        />
                                    </Tooltip>
                                ))}
                            </Stack>
                        </Box>

                        <Paper variant="outlined" className="overflow-hidden">
                            <Tabs value={tab} onChange={handleTabChange} sx={{px: 1}}>
                                <Tab value="visual" label="Edit" />
                                <Tab value="html" label="HTML" />
                                <Tab value="preview" label="Preview" />
                            </Tabs>
                            <Divider />

                            {tab === "visual" && (
                                <>
                                    <Stack
                                        direction="row"
                                        flexWrap="wrap"
                                        sx={{px: 1, py: 0.5, bgcolor: "#fafafa"}}
                                    >
                                        {toolbarCommands.slice(0, 7).map((item) => (
                                            <Tooltip key={item.label} title={item.label}>
                                                <IconButton
                                                    size="small"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() =>
                                                        runCommand(item.command, item.value)
                                                    }
                                                >
                                                    {item.icon}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                        <Tooltip title="Add link">
                                            <IconButton
                                                size="small"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={handleAddLink}
                                            >
                                                <LinkIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {toolbarCommands.slice(7).map((item) => (
                                            <Tooltip key={item.label} title={item.label}>
                                                <IconButton
                                                    size="small"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={() => runCommand(item.command)}
                                                >
                                                    {item.icon}
                                                </IconButton>
                                            </Tooltip>
                                        ))}
                                    </Stack>
                                    <Divider />
                                    <iframe
                                        key={visualVersion}
                                        ref={iframeRef}
                                        title="Welcome email editor"
                                        // No allow-scripts: pasted HTML can never run code here
                                        sandbox="allow-same-origin"
                                        srcDoc={visualSrcDoc}
                                        onLoad={handleVisualLoad}
                                        style={{width: "100%", height: 640, border: 0, background: "#fff"}}
                                    />
                                </>
                            )}

                            {tab === "html" && (
                                <Box sx={{p: 2}}>
                                    <TextField
                                        value={html}
                                        onChange={(e) => setHtml(e.target.value)}
                                        multiline
                                        minRows={24}
                                        fullWidth
                                        spellCheck={false}
                                        InputProps={{
                                            sx: {fontFamily: "monospace", fontSize: "0.82rem"}
                                        }}
                                    />
                                </Box>
                            )}

                            {tab === "preview" && (
                                <>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{px: 2, py: 1, bgcolor: "#fafafa"}}
                                    >
                                        <strong>Subject:</strong>{" "}
                                        {fillPlaceholders(subject, previewValues)} · shown with
                                        sample member details
                                    </Typography>
                                    <Divider />
                                    <iframe
                                        title="Welcome email preview"
                                        sandbox=""
                                        srcDoc={fillPlaceholders(html, previewValues)}
                                        style={{width: "100%", height: 640, border: 0, background: "#fff"}}
                                    />
                                </>
                            )}
                        </Paper>

                        <Box>
                            <Button
                                color="error"
                                onClick={handleReset}
                                disabled={data.is_default || isSaving}
                            >
                                Reset to default email
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Box>
        </>
    );
}
