// NumberInputForm.jsx
import React, { useState,useEffect } from 'react';


function ThReward() {
    const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL; 
    const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER; 
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS;   

    const [updateId,setUpdateId] = useState(0)
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

    if (typeof window === 'undefined') {
      // Handle Server-Side Rendering (SSR) if applicable (e.g., Next.js)
      setError("Cannot access URL on the server.");
      setIsLoading(false);
      return;
    }

    // 2. Access the raw query string from the browser's location object
    const queryString = window.location.search; // Returns "?id=19"

    // 3. Use the native URLSearchParams API to parse the string
    const params = new URLSearchParams(queryString);

    // 4. Get the value for the 'id' key
    const idFromUrl = params.get('id'); // Value: "19"
    setUpdateId(parseInt(idFromUrl, 10) )
      let user = sessionStorage.getItem("admin_user");
      let pass = sessionStorage.getItem("admin_pass");
      if(user !== adminUser || pass !== adminPass)
      {
        window.location.replace('/admin-login')
      }
    const scheduleAPI = `${apiUrl}/bff-lotto-app/backoffice/th-schedule`;
   // FIX: Define an inner async function and call it immediately.
    const fetchSchedule = async () => {
     
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
    number31: finalData.data[0].reward_3,
    number32: finalData.data[0].reward_4,
    number21: finalData.data[0].reward_5,
    number22: finalData.data[0].reward_6,
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


// FIX 1: The function must be declared as 'async' to use 'await'.
const handleSubmit = async (event) => { 
    event.preventDefault();
    
    // Check if ID is available before submitting
    if (!updateId) {
        console.error("Cannot submit: Update ID is missing.");
        return;
    }
    
    const updatePayload = {
      // FIX 2: Ensure updateId is defined and available in scope
      id: updateId, 
      reward_1: Number(inputs.number1),
      reward_2: Number(inputs.number2),
      reward_31: Number(inputs.number31), 
      reward_32: Number(inputs.number32), 
      reward_21: Number(inputs.number21),
      reward_22: Number(inputs.number22),     
    };
const rewardAPI = `${apiUrl}/bff-lotto-app/backoffice/th-reward`;
console.log(JSON.stringify(updatePayload))
    try {
        const response = await fetch(rewardAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // FIX 3: Use the correctly named payload: updatePayload
            body: JSON.stringify(updatePayload), 
        });

        if (!response.ok) {
            // Attempt to read error message from the response body
            const errorText = await response.text();
            let errorMessage = `HTTP error! Status: ${response.status}.`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage += ` Message: ${errorJson.message || errorText}`;
            } catch (e) {
                errorMessage += ` Body: ${errorText}`;
            }
            throw new Error(errorMessage);
        }

        // Handle success response (check for content before parsing)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            console.log("Reward update successful (with JSON data):", data);
            // Optionally handle success notification or redirect here
            alert("บันทึกสำเร็จ")
             window.location.replace('th-calendar');
           
        } else {
            console.log("Reward update successful (no JSON content).");
            // Optionally handle success notification or redirect here
            
        }

    } catch (error) {
        console.error("Failed to submit reward data:", error.message);
        // Display an error to the user
        alert(`Submission failed: ${error.message}`);
    }
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