import React, { useState, useEffect } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL; 
const AddCredit = () => {
  const [memberId, setMemberId] = useState('');
  const [credit, setCredit] = useState('');
  const [secretSign, setSecretSign] = useState('');
  const [orderId, setOrderId] = useState('');
  
  // Use useEffect to parse the URL query parameters when the component mounts
  useEffect(() => {
// --- FETCH SCHEDULE DATA ON MOUNT (FIXED) ---
    if(params.get('secret_sign') !== secretSign)
{
  window.location.replace('/app/admin-login');
}

     
     if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    setMemberId(params.get('member_id') || '');
    setCredit(params.get('credit') || '');
    setSecretSign(params.get('secret_sign') || '');
    setOrderId(params.get('order_id') || '');
  }
  }, []); // Empty dependency array to run once on mount

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (memberId && credit && secretSign && orderId) {
        let alert_message = "ล้มเหลว"; // Initialize with a default value
        let apiData = null; // Variable to hold the parsed API response data

        try {
            // NOTE: Replace with your actual withdrawal API endpoint
            const response = await fetch(`${apiUrl}/bff-lotto-app/promtpay-credit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    member_id: memberId,
                    credit: credit,
                    secret_sign: secretSign,
                    order_id: orderId,
                }),
            });

            apiData = await response.json(); // Store the parsed data
            console.log('API Response:', apiData);

            if (apiData && apiData.message === "success") {
                alert_message = "สำเร็จ"; // Update the message on success
            }
        } catch (e) {
            console.error('API call failed:', e);
        } finally {
            console.log("API call finished.");
            alert(alert_message); // Use the variable to display the alert
        }
    } else {
        alert('Missing required parameters from the URL.');
    }
};

  return (
  <div className="top-up-page">
  <div className="top-up-container">
    <form onSubmit={handleSubmit} className="top-up-form">
      <h2 className="top-up-title">ตรวจสอบยอดโอน ก่อนเพิ่มเครดิต</h2>

      <div className="form-group">
        <label htmlFor="memberId" className="form-label">Member ID:</label>
        <input
          type="text"
          id="memberId"
          value={memberId}
          readOnly
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="credit" className="form-label">Credit:</label>
        <input
          type="text"
          id="credit"
          value={credit}
          readOnly
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="secretSign" className="form-label">Order ID:</label>
        <input
          type="text"
          id="secretSign"
          value={orderId}
          readOnly
          className="form-input"
        />
      </div>

      <button type="submit" className="submit-button">
        ยืนยัน
      </button>
    </form>
  </div>
</div>


  );
};

export default AddCredit;