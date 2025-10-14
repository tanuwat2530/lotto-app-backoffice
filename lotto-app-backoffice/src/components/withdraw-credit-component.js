import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react'; // ✅ lightweight icon library

const apiUrl = process.env.NEXT_PUBLIC_BFF_API_URL;
const secretSign = process.env.NEXT_PUBLIC_SECRET_SIGN;

const WithdrawCredit = () => {
  const [memberId, setMemberId] = useState('');
  const [credit, setCredit] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [accName, setAccName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accNumber, setAccNumber] = useState('');
 
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('secret_sign') !== secretSign) {
      window.location.replace('/app/admin-login');
    }

    if (typeof window !== 'undefined') {
      setMemberId(params.get('member_id') || '');
      setCredit(params.get('credit') || '');
      setAccName(params.get('account_name') || '');
      setAccNumber(params.get('account_number') || '');
      setBankName(params.get('bank_name') || '');
    }
  }, []);

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopyMessage('คัดลอกสำเร็จ!');
    setTimeout(() => setCopyMessage(''), 1500);
  };

  return (
    <div className="withdraw-page">
      <div className="withdraw-container">
        <form className="withdraw-form">
          <h2 className="withdraw-title">ตรวจสอบยอด ก่อนถอนเงิน</h2>

          <div className="form-group">
            <label htmlFor="memberId" className="form-label">Member ID:</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="memberId"
                value={memberId}
                readOnly
                className="form-input"
              />
             
            </div>
          </div>

          <br />
          <h2 className="withdraw-title">คัดลอกข้อมูลด้านล่างเท่านั้น</h2>

          {[
            { label: 'หมายเลขบัญชี:', value: accNumber },
            { label: 'ชื่อบัญชี:', value: accName },
            { label: 'ธนาคาร:', value: bankName },
            { label: 'ยอดถอน:', value: credit },
          ].map((item, index) => (
            <div className="form-group" key={index}>
              <label className="form-label">{item.label}</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  value={item.value}
                  readOnly
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(item.value)}
                  className="copy-btn"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          ))}

          {copyMessage && <div className="copy-message">{copyMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default WithdrawCredit;
