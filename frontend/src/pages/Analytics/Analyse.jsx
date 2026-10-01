import React from 'react'
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios'
import './analytics.css';
import { useStore } from '../../context/StoreContext';
import PriceChart from './PriceChart';
const Analyse = () => {
  const { backendUrl, token, isAdmin, setToken } = useStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    setToken('');
    navigate('/login');
  }
  const [userQuestion,setUserQuestion]=React.useState({
    query:'',
    prompt:''
  });
  const [responseData,setResponseData]=React.useState({});
  const [profile,setProfile]=React.useState({});
  const [analytics,setAnalytics]=React.useState({});
  const [errors,setErrors] =React.useState('');
  const [answer,setAnswer]=React.useState({});
  const [priceHistory,setPriceHistory]=React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);


  const handleChange=(e)=>{
    setUserQuestion({...userQuestion,[e.target.name]:e.target.value})
    console.log(e.target.value);
  }
  function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")   // add space before capital letters
    .replace(/^./, str => str.toUpperCase());
}

  // The AI doesn't always return an object of fields for a section — it often
  // returns a plain narrative string instead. Render either shape.
  function renderSection(value) {
    if (value === null || value === undefined) return null;
    if (typeof value !== "object") {
      return <p className="mb-0">{String(value)}</p>;
    }
    return Object.entries(value).map(([key, val]) => {
      if (typeof val === "object" && val !== null) {
        return (
          <div key={key} className="mb-3">
            <h6 className="fw-semibold">{formatKey(key)}</h6>
            <ul className="mb-0">
              {Object.entries(val).map(([k, v]) => (
                <li key={k}>
                  <strong>{formatKey(k)}:</strong>{" "}
                  {typeof v === "number" ? v.toFixed(4) : String(v)}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      return (
        <p key={key} className="mb-1">
          <strong>{formatKey(key)}:</strong>{" "}
          {typeof val === "number" ? val.toLocaleString() : String(val)}
        </p>
      );
    });
  }

        const handleSubmit = async (e) => {
          e.preventDefault();

          if (!userQuestion.query || !userQuestion.prompt) {
            setErrors("Please choose stock and enter a question");
            return;
          }

          setErrors("");
          setIsLoading(true);   // ✅ START LOADING

          try {
            const response = await axios.post(
              `${backendUrl}/analyze/analyze-stock`,
              userQuestion,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.status === 200) {
              const parsed = response.data.parsedAnswer;

              setResponseData(parsed);
              setProfile(
                parsed["Company Profile"] ||
                parsed["Companies Profile"] ||
                parsed.CompanyProfile ||
                parsed.CompaniesProfile ||
                {}
              );
              setAnalytics(parsed.Analytics || {});
              setAnswer(parsed.Answer || {});
              setPriceHistory(response.data.priceHistory || []);
            }
          } catch (err) {
            setErrors("Something went wrong");
            console.log(err);
          } finally {
            setIsLoading(false); // ✅ STOP LOADING
          }
        };


  return (
    <>
  {/* Navbar */}
          <nav className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar shadow-sm">
          <div className="container">
            <Link to="/home" className="navbar-brand d-flex align-items-center gap-2">
              <img
                src="/images/logo.jpeg"
                alt="Intelligent Stock Market Forecasting System Logo"
                width="42"
                height="42"
                className="rounded"
              />
              <span className="fw-bold fs-5">Intelligent Stock Market Forecasting System</span>
            </Link>

            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse mt-3 mt-lg-0" id="navbarNav">
              <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/home">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/news">Get Today’s News</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-hover active" to="/analyze">Analyse Stock</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link nav-hover" to="/admin/audit-log">Admin</Link>
                  </li>
                )}
                {!token && (
                  <li className="nav-item">
                    <Link className="nav-link nav-hover" to="/login">Login</Link>
                  </li>
                )}
                {token && (
                  <li className="nav-item">
                    <button type="button" className="btn btn-sm btn-outline-light" onClick={handleLogout}>Logout</button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>


  {/* Page Content */}
  <div className="container-fluid" style={{ marginTop: "90px" }}>
    <div className="container">

      {/* Input Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">

            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold">Select Stock</label>
              <select
              className="form-select h-100"
              onChange={handleChange}
              name="query"
              value={userQuestion.query}
            >
                <option value="">Select Stock</option>
                <option value="SBIN.NS">State Bank of India</option>
                <option value="HDFCBANK.NS">HDFC Bank</option>
                <option value="ICICIBANK.NS">ICICI Bank</option>
                <option value="AXISBANK.NS">Axis Bank</option>
                <option value="KOTAKBANK.NS">Kotak Mahindra Bank</option>

                <option value="RELIANCE.NS">Reliance Industries</option>
                <option value="TCS.NS">Tata Consultancy Services</option>
                <option value="INFY.NS">Infosys</option>
                <option value="WIPRO.NS">Wipro</option>
                <option value="HCLTECH.NS">HCL Technologies</option>

                <option value="TATAMOTORS.NS">Tata Motors</option>
                <option value="M&M.NS">Mahindra & Mahindra</option>
                <option value="MARUTI.NS">Maruti Suzuki</option>
                <option value="BAJAJ-AUTO.NS">Bajaj Auto</option>
                <option value="EICHERMOT.NS">Eicher Motors</option>

                <option value="TATASTEEL.NS">Tata Steel</option>
                <option value="JSWSTEEL.NS">JSW Steel</option>
                <option value="HINDALCO.NS">Hindalco</option>

                <option value="ITC.NS">ITC</option>
                <option value="HINDUNILVR.NS">Hindustan Unilever</option>
                <option value="NESTLEIND.NS">Nestle India</option>

                <option value="LT.NS">Larsen & Toubro</option>
                <option value="ADANIENT.NS">Adani Enterprises</option>
                <option value="ADANIPORTS.NS">Adani Ports</option>

                <option value="POWERGRID.NS">Power Grid</option>
                <option value="NTPC.NS">NTPC</option>
                <option value="ONGC.NS">ONGC</option>

              </select>
            </div>

            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold">Ask AI</label>
              <input
                type="text"
                className="form-control"
                placeholder="Is this good for long-term?"
                name="prompt"
                onChange={handleChange}
                value={userQuestion.prompt}
              />
            </div>

            <div className="col-12 col-md-2 d-grid">
                      <button
                      className="btn btn-primary h-100"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? "Analyzing..." : "🔍 Analyze"}
               </button>

            </div>

            {errors && (
              <div className="col-12">
                <small className="text-danger">{errors}</small>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-2">
            <span className="badge bg-primary px-3 py-2">Company Profile</span>
            <span className="badge bg-secondary px-3 py-2">Analytics</span>
            <span className="badge bg-success px-3 py-2">AI Answer</span>
          </div>
        </div>
      </div>
        {/* Loading State – ONLY after Analyze click */}
                {isLoading && (
                  <div className="d-flex justify-content-center align-items-center my-5">
                    <div className="text-center">
                      <div className="spinner-border text-primary mb-3" role="status" />
                      <p className="fw-semibold text-muted">
                        Analyzing stock data with AI…
                      </p>
                    </div>
                  </div>
                )}






        {profile && Object.keys(profile).length > 0 && (
        <div key={userQuestion.query}>

      {/* Company Profile */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Company Profile</div>
        <div className="card-body">
          {renderSection(profile)}
        </div>
      </div>

      {/* Price Chart */}
      <PriceChart data={priceHistory} symbol={userQuestion.query} />

      {/* Analytics */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Analytics</div>
        <div className="card-body">
          {renderSection(analytics)}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="card shadow-sm border-primary mb-5">
        <div className="card-header bg-primary text-white fw-bold">
          AI Recommendation
        </div>
        <div className="card-body">
          {answer && typeof answer !== "object" && (
            <p className="mb-0">{String(answer)}</p>
          )}
          {Array.isArray(answer) && answer.length > 0 && (
            <ul className="mb-0 ps-3">
              {answer.map((point, i) => (
                <li key={i} className="mb-2">{String(point)}</li>
              ))}
            </ul>
          )}
          {answer &&
            typeof answer === "object" &&
            !Array.isArray(answer) &&
            Object.entries(answer).map(([key, value]) => {
              if (typeof value === "object" && value !== null) {
                return (
                  <div key={key} className="mb-3">
                    <h6 className="fw-semibold">{formatKey(key)}</h6>
                    <ul>
                      {Object.entries(value).map(([k, v]) => (
                        <li key={k}>
                          <strong>{formatKey(k)}:</strong>{" "}
                          {typeof v === "number" ? v.toFixed(4) : v}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return (
                <p key={key}>
                  <strong>{formatKey(key)}:</strong>{" "}
                  {typeof value === "boolean" ? (
                    value ? (
                      <span className="text-success fw-bold">✅ Good Time to Buy</span>
                    ) : (
                      <span className="text-danger fw-bold">
                        ❌ Decide With Your Own Risk
                      </span>
                    )
                  ) : (
                    value
                  )}
                </p>
              );
            })}
        </div>
      </div>
            </div>
        )}

    </div>
  </div>
</>

  )
}

export default Analyse;