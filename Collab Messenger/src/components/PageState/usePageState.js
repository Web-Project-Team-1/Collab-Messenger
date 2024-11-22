import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function usePageState() {
    const navigate = useNavigate();

    useEffect(() => {
        // Listen for navigation and save the current path
        const saveCurrentPage = () => localStorage.setItem("lastVisitedPage", window.location.pathname);
        window.addEventListener("beforeunload", saveCurrentPage);

        // Restore the last visited page on mount
        const lastPage = localStorage.getItem("lastVisitedPage");
        if (lastPage && lastPage !== "/login") {
            navigate(lastPage);
        }

        // Cleanup the event listener on unmount
        return () => window.removeEventListener("beforeunload", saveCurrentPage);
    }, [navigate]);
}
