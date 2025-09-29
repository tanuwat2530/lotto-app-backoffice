// NumberInputForm.jsx
import React, { useState,useEffect } from 'react';
import '../styles/th-reward-page.css'; // 1. Import the CSS file

function ThReward() {
  const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL; 
  const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER; 
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS;   
  const [inputs, setInputs] = useState({
    number1: '',
    number2: '',
    number21: '',
    number22: '',
    number31: '',
    number32: '',
  });
  const [title, setTitle] = useState('');
  

  
  useEffect(() =>{

      let user = sessionStorage.getItem("admin_user");
      let pass = sessionStorage.getItem("admin_pass");
      if(user !== adminUser || pass !== adminPass)
      {
        window.location.replace('/admin-login')
      }
  const scheduleAPI = `${apiUrl}/bff-lotto-app/backoffice/th-schedule`;
   // FIX: Define an inner async function and call it immediately.
    const fetchSchedule = async () => {
     
    const scheduleAPI = `${apiUrl}/bff-lotto-app/backoffice/th-schedule`;
     try {
        // Use POST only if the backend requires it, otherwise GET is typical for fetches
        const response = await fetch(scheduleAPI,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Note: Sending an empty body for a POST that expects data might be rejected by the server
        }); 
        if (!response.ok) {
          let errorText = await response.text();
          try {
              const errorJson = JSON.parse(errorText);
              errorText = errorJson.message || errorText;
          } catch (jsonError) {
              // Ignore if it's not JSON
          }
          // FIX: Throw error to exit the try block and move to catch
          throw new Error(`HTTP Error Status ${response.status}: ${errorText}`); 
        }

      // FIX: The redundant 'if (!response.ok)' block was removed to prevent stream reading error.
      // Now, if response.ok is true, we proceed to read JSON.
      let responseJson = {};
      try {
        responseJson = await response.json();
        
        let finalData = responseJson;

        // NEW FIX: Check for the unexpected nested JSON string format
        if (typeof responseJson.response === 'string') {
          try {
            // Attempt to parse the nested string
            finalData = JSON.parse(responseJson.response);
            
          } catch (e) {
            console.warn("Failed to parse nested response string:", e);
          }
        }

        // FIX: Check for the 'data' field expected from the Go service (code: "200", data: [...])
        if (finalData.code === "200" && Array.isArray(finalData.data)) {
          setTitle(finalData.data[0].date)  
    setInputs({
    number1: finalData.data[0].reward_1,
    number2: finalData.data[0].reward_2,
    number21: finalData.data[0].reward_3,
    number22: finalData.data[0].reward_4,
    number31: finalData.data[0].reward_5,
    number32: finalData.data[0].reward_6,
});
           
        } else {
            console.warn('API response structure unexpected (missing code 200 or array data):', finalData);
            
        }

      } catch(e) {
        // Handle successful response with no JSON body (e.g., 204 No Content)
        console.warn("Successful response but failed to parse JSON:", e);
       
      }
     
      } catch (err) {
        console.error("Fetch schedule failed:", err);
        
      } finally {

      }
    };
    fetchSchedule(); 
  }, []); // Empty dependency array means this runs only on mount

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const numbers = {
      n1: Number(inputs.number1),
      n2: Number(inputs.number2),
      n31: Number(inputs.number31),
      n32: Number(inputs.number32),
      n21: Number(inputs.number21),
      n22: Number(inputs.number22),
                  
    };

    console.log('Form Submitted!');
    console.log('Parsed numbers:', numbers);

    // Optional: Clear the form after submission
    // setInputs({ number1: '', number2: '', number3: '', number4: '' });
  };

  // 2. Use className instead of inline styles
  return (
    
    <div className="form-container">
        <br/>
        <center>      <h2>ผลรางวัลงวด {title}</h2></center>
        <br/><br/>

      <form onSubmit={handleSubmit}>
       
        <div className="input-group">
          <label>​3 ตัวบน :</label>
          <input
            type="number"
            id="number1"
            name="number1"
            value={inputs.number1}
            onChange={handleInputChange}
            required
            className="number-input"
          />
        </div>

         <div className="input-group">
          <label>2 ตัวบน :</label>
        
          <input
            type="number"
            id="number2"
            name="number2"
            value={inputs.number2}
            onChange={handleInputChange}
            required
            className="number-input"
          />
        </div>

        <div className="input-group">
          <label>3 ตัวล่าง :</label>
          
          <input
            type="number"
            id="number31"
            name="number31"
            value={inputs.number31}
            onChange={handleInputChange}
            required
            className="number-input"
          />

           <input
            type="number"
            id="number32"
            name="number32"
            value={inputs.number32}
            onChange={handleInputChange}
            required
            className="number-input"
          />
        </div>
        
       

        <div className="input-group">
          <label>2 ตัวล่าง :</label>
          <input
            type="number"
            id="number21"
            name="number21"
            value={inputs.number21}
            onChange={handleInputChange}
            required
            className="number-input"
          />
           <input
            type="number"
            id="number22"
            name="number22"
            value={inputs.number22}
            onChange={handleInputChange}
            required
            className="number-input"
          />
        </div>

        <button 
          type="submit"
          className="submit-button"
        >
          บันทึกข้อมูล
        </button>
      </form>
    </div>
  );
}

export default ThReward;