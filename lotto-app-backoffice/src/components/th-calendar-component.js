import React, { useState } from 'react';
import '../styles/th-calendar-page-style.css'; // Import the dedicated CSS file

// --- Constants ---
const THAI_MONTHS = Array.from({ length: 12 }, (_, i) => {
  return new Intl.DateTimeFormat('th-TH', { 
    month: 'long', 
    calendar: 'buddhist' 
  }).format(new Date(2025, i, 1)); 
});

// Using a placeholder string for the API URL here.
// In your environment, you should use the line you provided:
 const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL; 

// --- Helper Functions ---

/**
 * Formats a Date object to get the Thai month and Buddhist Era year.
 */
const getThaiMonthYear = (date) => {
  return new Intl.DateTimeFormat('th-TH', {
    month: 'long',
    year: 'numeric',
    calendar: 'buddhist',
  }).format(date);
};

/**
 * Gets the Thai short names for the days of the week (อา. - ส.).
 */
const getThaiDayNames = () => {
  const formatter = new Intl.DateTimeFormat('th-TH', { weekday: 'short', calendar: 'buddhist' });
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(2023, 0, 1 + i);
    return formatter.format(day);
  });
};

// --- Renderer for Time Options ---
const renderTimeOptions = (limit) => {
  const options = [];
  for (let i = 0; i < limit; i++) {
    const value = i.toString().padStart(2, '0');
    options.push(
      <option key={value} value={value}>
        {value}
      </option>
    );
  }
  return options;
};

// --- Main Calendar Component ---

const ThaiCalendarApp = () => {
  const initialDate = new Date();
  
  // Current date in C.E. is used for calendar logic
  const [currentDate, setCurrentDate] = useState(initialDate);
  
  // Time state is separate to handle time selection independently
  const [selectedHour, setSelectedHour] = useState(initialDate.getHours().toString().padStart(2, '0'));
  const [selectedMinute, setSelectedMinute] = useState(initialDate.getMinutes().toString().padStart(2, '0'));


  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar setup details
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayIndex = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  
  // Today's date logic
  const today = new Date();
  const todayDateStr = `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
  
  // B.E. year for display
  const currentBEYear = year + 543;

  // Handlers for month navigation
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  // Handlers for time selection
  const handleHourChange = (e) => {
    setSelectedHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setSelectedMinute(e.target.value);
  };
  
  const handleDayClick = (day) => {
      // Sets the date to the clicked day, preserving the month and year
      setCurrentDate(new Date(year, month, day));
  };

 // --- SUBMIT FUNCTIONALITY ---
const handleSubmit = async () => { // 👈 FIX: Declared as async
    // 1. Construct the final Date object using the selected date and time
    const selectedDateTime = new Date(
        currentDate.getFullYear(), 
        currentDate.getMonth(), 
        currentDate.getDate(), 
        parseInt(selectedHour, 10), 
        parseInt(selectedMinute, 10)
    );
    
    // --- TIMESTAMP CALCULATION ---
    const timestampSec = Math.floor(selectedDateTime.getTime() / 1000); // Timestamp in seconds
    // ----------------------------

    // 2. Format the DATE using Thai localization (B.E.)
    const dateFormatter = new Intl.DateTimeFormat('th-TH', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        calendar: 'buddhist',
    });
    const formattedDate = dateFormatter.format(selectedDateTime);

    // 3. Format the TIME using Thai localization (24hr)
    const timeFormatter = new Intl.DateTimeFormat('th-TH', {
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit', 
        hour12: false, 
    });
    const formattedTime = timeFormatter.format(selectedDateTime);

    // 4. API Call Setup
    const ENDPOINT = `${apiUrl}/bff-lotto-app/backoffice/th-calendar`;

    const dataPayload = {
        date: formattedDate,
        time: formattedTime,
        timestamp: timestampSec,
    };

    try {
      console.log('Sending data to API:', ENDPOINT, dataPayload);
      
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers here if needed, e.g., 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataPayload),
      });

      if (!response.ok) {
        // If the response is not OK (4xx, 5xx), try to extract detailed error message
        let errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            errorText = errorJson.message || errorText;
        } catch (jsonError) {
            // Ignore if it's not JSON
        }
        throw new Error(`HTTP Error Status ${response.status}: ${errorText}`);
      }
       
      // Successfully sent data (200-299 status)
      let responseJson = {};
      try {
        // Try to parse JSON response for success message
        responseJson = await response.json();
      } catch(e) {
        // Handle successful response with no JSON body (e.g., 204 No Content or plain text success)
        responseJson.message = "Successfully saved date/time.";
      }

      // Success alert
      alert(`✅ บันทึกสำเร็จ!\n\nวันที่: ${formattedDate}\nเวลา: ${formattedTime} น.\nTimestamp: ${timestampSec}\nResponse: ${JSON.stringify(responseJson, null, 2)}`);
      
    } catch (err) {
      // Catch network errors (CORS, offline) or errors thrown from the response handling
      console.error("Add calendar failed:", err);
       alert(`❌ ผิดพลาด: ไม่สามารถบันทึกข้อมูลได้\n\nรายละเอียด: ${err.message || "Unknown error occurred"}`);
    } 
  
};
// ----------------------------- 

  const renderCalendarDays = () => {
    const calendarDays = [];

    // 1. Padding (Empty cells before the 1st of the month)
    for (let i = 0; i < startingDayIndex; i++) {
      calendarDays.push(<div key={`pad-${i}`} className="calendar-day empty"></div>);
    }

    // 2. Days of the Month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
      const dayDateStr = `${day}-${month}-${year}`;
      const isToday = dayDateStr === todayDateStr;
      
      let dayClasses = "calendar-day";

      // Check if this day is the currently selected date
      const isSelectedDay = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();

      if (isToday) {
        dayClasses += " today";
      }
      
      if (isSelectedDay) {
          dayClasses += " selected-day"; 
      }
      
      if (isWeekend) {
        dayClasses += " weekend";
      }

      calendarDays.push(
        <div 
          key={day} 
          className={dayClasses} 
          onClick={() => handleDayClick(day)} // Updated click handler
        >
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  const thaiDayNames = getThaiDayNames();

  return (
    
    <div className="thai-calendar-app">
      
      <div className="calendar-container">
        <center><h3>เพิ่มวันที่สำหรับออกรางวัล (หวยไทย)</h3></center>

        {/* Header: Month, Year, and Navigation */}
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="nav-button" aria-label="เดือนก่อนหน้า">
            &larr;
          </button>
          <h1 className="calendar-title">
            {getThaiMonthYear(currentDate)}
          </h1>
          <button onClick={handleNextMonth} className="nav-button" aria-label="เดือนถัดไป">
            &rarr;
          </button>
        </div>

        {/* Day Headers (อา. - ส.) */}
        <div className="day-headers">
          {thaiDayNames.map((dayName, index) => (
            <div 
              key={index} 
              className={`day-name ${index === 0 ? 'sunday-name' : ''}`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>
        
        {/* --- Time Picker --- */}
        <div className="time-picker-controls">
            <label className="time-picker-label">เลือกเวลา (24hr):</label>
            <div className="time-select-group">
                {/* Hour Dropdown */}
                <select
                    value={selectedHour}
                    onChange={handleHourChange}
                    className="time-select hour-select"
                    aria-label="ชั่วโมง"
                >
                    {renderTimeOptions(24)}
                </select>
                <span className="time-separator">:</span>
                {/* Minute Dropdown */}
                <select
                    value={selectedMinute}
                    onChange={handleMinuteChange}
                    className="time-select minute-select"
                    aria-label="นาที"
                >
                    {renderTimeOptions(60)}
                </select>
            </div>
        </div>
        {/* --- End Time Picker --- */}
        

        {/* Footer Info */}
        <div className="calendar-footer">
             <p className="selected-date-display">
                วัน-เวลาที่เลือก: {currentDate.getDate()} {THAI_MONTHS[currentDate.getMonth()]} พ.ศ. {currentBEYear} | {selectedHour}:{selectedMinute} น.
            </p>
            
            {/* --- SUBMIT BUTTON --- */}
            <button 
                className="submit-button"
                onClick={handleSubmit}
            >
                บันทึก
            </button>
            {/* ----------------------- */}
        </div>
      </div>
    </div>
  );
};

export default ThaiCalendarApp;
