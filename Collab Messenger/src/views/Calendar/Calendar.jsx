import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import './Calendar.css'

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        setCurrentDate(new Date());
    }, []);

    return (
        <div>
            <Calendar
                value={currentDate}
                className="react-calendar"
                tileClassName="custom-calendar-tile"
            />
        </div>
    );
}
