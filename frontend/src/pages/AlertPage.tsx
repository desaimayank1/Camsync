// Alerts.tsx
import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Pagination,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Alert {
    timestamp: string;
    camera: string;
    event: "Motion Detected" | "Face Recognized" | "Camera Offline" | "Camera Online";
    details: string;
    actionText?: string;
}

const alerts: Alert[] = [
    {
        timestamp: "2024-03-15 10:30:15",
        camera: "Front Door",
        event: "Motion Detected",
        details: "Person detected at the entrance.",
        actionText: "View Clip",
    },
    {
        timestamp: "2024-03-15 10:32:01",
        camera: "Backyard",
        event: "Face Recognized",
        details: "John Doe",
        actionText: "View Clip",
    },
    {
        timestamp: "2024-03-15 10:28:45",
        camera: "Living Room",
        event: "Camera Offline",
        details: "Connection lost.",
        actionText: "Troubleshoot",
    },
    {
        timestamp: "2024-03-15 10:25:00",
        camera: "Front Door",
        event: "Motion Detected",
        details: "Vehicle detected in the driveway.",
        actionText: "View Clip",
    },
    {
        timestamp: "2024-03-15 10:22:18",
        camera: "Backyard",
        event: "Camera Online",
        details: "Connection re-established.",
        actionText: "View Stream",
    },
];

const eventColor = (event: Alert["event"]) => {
    switch (event) {
        case "Motion Detected":
            return "error";
        case "Face Recognized":
            return "info";
        case "Camera Offline":
            return "warning";
        case "Camera Online":
            return "success";
        default:
            return "default";
    }
};

const Alerts: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    height: "100%",
                    width: "100%",
                    p: { xs: 2, md: 3 },
                }}
            >
                <Typography variant="h5" fontWeight={600} mb={4}>
                    Real-time Alerts
                </Typography>

                <Card
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 0 }}>
                        <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
                            <Table size={isMobile ? "small" : "medium"} stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Timestamp</TableCell>
                                        <TableCell>Camera</TableCell>
                                        <TableCell>Event</TableCell>
                                        <TableCell>Details</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {alerts.map((alert, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{alert.timestamp}</TableCell>
                                            <TableCell>{alert.camera}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={alert.event}
                                                    color={eventColor(alert.event)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{alert.details}</TableCell>
                                            <TableCell align="right">
                                                {alert.actionText && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        sx={{ textTransform: "none" }}
                                                    >
                                                        {alert.actionText}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            px={2}
                            py={1.5}
                            borderTop={`1px solid ${theme.palette.divider}`}
                        >
                            <Typography variant="body2">Showing 1 to 5 of 42 results</Typography>
                            <Pagination count={9} variant="outlined" shape="rounded" size="small" />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

export default Alerts;
