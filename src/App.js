import React, { useState } from "react";

const styles = {
  app: {
    width: "100vw",          // full viewport width
    height: "100vh",         // full viewport height
    padding: "24px 48px",    // add horizontal padding
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#121212",
    color: "#e0e0e0",
    boxSizing: "border-box",
    overflowY: "auto",       // allow vertical scroll if needed
  },
  // Keep other styles unchanged or tweak section width
  section: {
    marginBottom: 32,
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#1e1e2f",
    boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
    maxWidth: "800px",      // optional: limit section width for readability
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 36,
    color: "#7f53ff", // Neon purple
    textShadow: "0 0 8px #7f53ff",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 12,
    borderRadius: 8,
    border: "none",
    outline: "none",
    fontSize: 16,
    backgroundColor: "#2a2a40",
    color: "#e0e0e0",
    boxShadow: "inset 0 0 5px #3b3b5c",
    transition: "box-shadow 0.3s ease",
  },
  inputFocus: {
    boxShadow: "0 0 8px #7f53ff",
  },
  button: {
    padding: "12px 24px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
    color: "#121212",
    background: "linear-gradient(90deg, #7f53ff, #647eff)", // Neon gradient
    boxShadow: "0 4px 12px #7f53ff",
    transition: "background 0.3s ease",
  },
  buttonHover: {
    background: "linear-gradient(90deg, #647eff, #7f53ff)",
  },
  messageBox: {
    backgroundColor: "#29294d",
    padding: 16,
    borderRadius: 12,
    boxShadow: "0 0 12px #647eff",
    marginTop: 16,
    fontWeight: "500",
  },
  validText: {
    color: "#3cff88",
    fontWeight: "700",
  },
  invalidText: {
    color: "#ff6f6f",
    fontWeight: "700",
  },
};

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("");
  const [chainValid, setChainValid] = useState(null);
  const [btnHover, setBtnHover] = useState(false);
  const [btnHover2, setBtnHover2] = useState(false);
  const [btnHover3, setBtnHover3] = useState(false);
  const API_BASE = "http://localhost:3000";

  async function getBalance() {
    if (!address) {
      alert("Please enter an address");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/balance/${address}`);
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      alert("Error fetching balance");
    }
  }

  async function submitTransaction(e) {
    e.preventDefault();
    if (!fromAddress || !toAddress || !amount || !privateKey) {
      alert("Please fill all transaction fields");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromAddress,
          to: toAddress,
          amount: Number(amount),
          privateKey: privateKey,
        }),
      });
      const text = await res.text();
      setMessage(text);
    } catch (err) {
      alert("Error submitting transaction");
    }
  }

  async function mineBlock() {
    try {
      const res = await fetch(`${API_BASE}/mine`);
      const text = await res.text();
      setMessage(text);
    } catch (err) {
      alert("Error mining block");
    }
  }

  async function checkChainValid() {
    try {
      const res = await fetch(`${API_BASE}/validate`);
      const data = await res.json();
      setChainValid(data.valid);
    } catch (err) {
      alert("Error checking chain validity");
    }
  }

  return (
    <div style={styles.app}>
      <h1 style={styles.header}>Welcome to SGACoin! </h1>

      <section style={styles.section}>
        <h2>Check Balance</h2>
        <input
          placeholder="Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.input}
          onFocus={(e) => (e.target.style.boxShadow = styles.inputFocus.boxShadow)}
          onBlur={(e) => (e.target.style.boxShadow = styles.input.boxShadow)}
        />
        <button
          style={{ ...styles.button, ...(btnHover ? styles.buttonHover : {}) }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={getBalance}
        >
          Get Balance
        </button>
        {balance !== null && <p style={{ marginTop: 12 }}>Balance: {balance}</p>}
      </section>

      <section style={styles.section}>
        <h2>Create Transaction</h2>
        <form onSubmit={submitTransaction}>
          <input
            placeholder="From Address"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.boxShadow = styles.inputFocus.boxShadow)}
            onBlur={(e) => (e.target.style.boxShadow = styles.input.boxShadow)}
          />
          <input
            placeholder="To Address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.boxShadow = styles.inputFocus.boxShadow)}
            onBlur={(e) => (e.target.style.boxShadow = styles.input.boxShadow)}
          />
          <input
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.boxShadow = styles.inputFocus.boxShadow)}
            onBlur={(e) => (e.target.style.boxShadow = styles.input.boxShadow)}
          />
          <input
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.boxShadow = styles.inputFocus.boxShadow)}
            onBlur={(e) => (e.target.style.boxShadow = styles.input.boxShadow)}
          />
          <button
            type="submit"
            style={{ ...styles.button, marginTop: 8, ...(btnHover2 ? styles.buttonHover : {}) }}
            onMouseEnter={() => setBtnHover2(true)}
            onMouseLeave={() => setBtnHover2(false)}
          >
            Send Transaction
          </button>
        </form>
      </section>

      <section style={styles.section}>
        <h2>Mine Block</h2>
        <button
          onClick={mineBlock}
          style={{ ...styles.button, ...(btnHover3 ? styles.buttonHover : {}) }}
          onMouseEnter={() => setBtnHover3(true)}
          onMouseLeave={() => setBtnHover3(false)}
        >
          Mine Pending Transactions
        </button>
      </section>

      <section style={styles.section}>
        <h2>Validate Blockchain</h2>
        <button onClick={checkChainValid} style={styles.button}>
          Check Chain Validity
        </button>
        {chainValid !== null && (
          <p style={chainValid ? styles.validText : styles.invalidText}>
            Blockchain is {chainValid ? "Valid ✅" : "Invalid ❌"}
          </p>
        )}
      </section>

      {message && (
        <section style={{ ...styles.section, backgroundColor: "#29294d" }}>
          <h2>Message</h2>
          <p>{message}</p>
        </section>
      )}
    </div>
  );
}

export default App;
