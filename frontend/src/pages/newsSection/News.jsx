import { Link, useNavigate } from "react-router-dom";
import "./News.css";
import axios from 'axios'
import React from 'react'
import NewsList from "./NewsList";
import { useStore } from '../../context/StoreContext';

export default function Navbar({ username = "User" }) {
  const { backendUrl, token, isAdmin, setToken } = useStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    setToken('');
    navigate('/login');
  }
  const [query,setQuery] =React.useState('');
  const [loading,setLoading] =React.useState(true);
  const [error,setError]=React.useState('');
  const [news,setNews]=React.useState([]);
  const handleChange=(e)=>{
    setQuery(e.target.value);
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!query) {
      setError("Enter Something to get News....");
    return ;
        }
        try{
          console.log("Request Sent...")
          const response=await axios.get(`${backendUrl}/analyze/news`,
            {
              params:{ query:query },
              headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log("Response received");
            if(response.status==200){
              setNews(response.data.news);
              console.log("News Added to Array:", news);
            }
            else{
              setError(response.error);
              console.log(response.error)
            }
        }
        catch(err){
          setError("Internal Server Error");
          console.log(err);
        }
     }
  return (
    <>
    <div className="conatiner d-flex justify-content-center">
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
<div
  className="container-fluid d-flex justify-content-center"
  style={{ marginTop: "100px" }}
>
  <div className="news-page-wrapper">

    {/* Heading */}
    <div className="text-center mb-4 fade-in">
      <h2 className="fw-bold text-dark">
        Market News Intelligence
      </h2>
      <p className="text-muted">
        Search stocks and get the latest market-moving news instantly
      </p>
    </div>

    {/* Search Card */}
    <div className="card news-search-card shadow-sm slide-up">
      <div className="card-body">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter stock name (e.g. Infosys, TCS, Reliance)"
            className="form-control news-input"
            onChange={handleChange}
          />
          <button
            className="btn btn-dark news-search-btn"
            onClick={handleSubmit}
          >
            🔍 Search
          </button>
        </div>

        {error && (
          <div className="mt-2 text-center">
            <small className="text-danger">{error}</small>
          </div>
        )}
      </div>
    </div>

    {/* News Results */}
    <div className="news-results mt-5">
      <NewsList news={news} />
    </div>

  </div>
</div>

      
    </div>
    </>
  );
}
