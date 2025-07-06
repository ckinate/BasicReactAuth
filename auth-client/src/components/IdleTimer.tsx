
// --- Configuration ---

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

// All times are in milliseconds
const IDLE_TIMEOUT = 2 * 60 * 1000; // 5 minutes for logout
const WARNING_DIALOG_TIMEOUT = 1 * 60 * 1000; // 4 minutes to show warning

const IdleTimer = () => {
    const { user, logout } = useAuth();
    const [isWarningModalOpen, setWarningModalOpen] = useState(false);

    // Refs to hold timer IDs
    const idleTimer = useRef<number | null>(null);
    const warningTimer = useRef<number | null>(null);
    // Function to call when the user is finally logged out
    const handleLogout = useCallback(() => {
        setWarningModalOpen(false);
        logout();
        console.log("User has been logged out due to inactivity.");
    }, [logout]);

    // Resets all timers and hides the warning modal.
    // This is the key function to call on any user activity.
    const resetTimers = useCallback(() => {
        // Hide the warning modal
        setWarningModalOpen(false);

        // Clear existing timers
        if (warningTimer.current) clearTimeout(warningTimer.current);
        if (idleTimer.current) clearTimeout(idleTimer.current);

        // Set new timers
        // We only do this if a user is logged in.
        if (user) {
            warningTimer.current = window.setTimeout(() => {
                setWarningModalOpen(true);
            }, WARNING_DIALOG_TIMEOUT);

            idleTimer.current = window.setTimeout(handleLogout, IDLE_TIMEOUT);
        }
    }, [user, handleLogout]);

    // This function is called when the user clicks "I'm still here" on the modal
    const handleStayLoggedIn = () => {
        resetTimers();
    };

    // --- Effect for setting up and tearing down event listeners ---
    useEffect(() => {
        // List of events that reset the timer
        const events = ['mousemove', 'keydown', 'click', 'scroll'];

        // If a user is logged in, start the timers and add listeners
        if (user) {
            resetTimers(); // Start the timers on login or page load
            
            events.forEach(event =>
                window.addEventListener(event, resetTimers)
            );
        }

        // Cleanup function: this runs when the component unmounts or the user logs out
        return () => {
            events.forEach(event =>
                window.removeEventListener(event, resetTimers)
            );
            // Clear any lingering timers
            if (warningTimer.current) clearTimeout(warningTimer.current);
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, [user, resetTimers]); // Rerun effect if user or resetTimers function changes

    // --- Render the Warning Modal ---
    if (!isWarningModalOpen) {
        return null;
    }
    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>You've been idle for a while</h2>
                <p>You will be logged out soon due to inactivity.</p>
                <button onClick={handleStayLoggedIn}>I'm still here</button>
            </div>
        </div>
    )
};


// --- Basic styles for the modal ---
const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

export default IdleTimer