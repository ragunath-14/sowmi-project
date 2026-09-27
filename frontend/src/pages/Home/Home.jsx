import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './Home.css';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
const Home = () => {
  const { backendUrl, token } = useStore();
  const [username,setUsername]=React.useState('');
  const [email,setEmail]=React.useState('');
  const navigate=useNavigate();
  const fetchUsers=async()=>{
    try{
      if(!token){
        navigate('/login');
        return ;
      }
      const response= await axios.get(`${backendUrl}/auth/home`,{
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if(response.status !==200){
        navigate('/login')
      }
      else{
        setEmail(response.data.email);
        setUsername(response.data.username)
      }
    }
    catch(err){
      console.log(err);
      navigate('/login');
    }
  }
  useEffect(()=>{
      fetchUsers();
    },[])
  return (
   <div className="home-wrapper">
      {/* Full-Screen Background Image */}
      <div className="background-image"></div>

      {/* Dark overlay for readability */}
      <div className="image-overlay"></div>

      {/* Main Content */}
      <div className="main-content">
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
                          </ul>
                        </div>
                      </div>
                    </nav>

        {/* Hero Section */}
        <section className="hero-section text-center text-white d-flex align-items-center">
          <div className="container">
            <h1 className="display-3 fw-bold mb-4">
              Smart Stock Insights Powered by AI
            </h1>
            <p className="lead mb-5 col-lg-8 mx-auto fs-4">
              Get real-time analytics, trend predictions, volatility metrics, and AI-powered buy/sell recommendations.
            </p>

            <div className="d-flex flex-column flex-sm-row justify-content-center gap-4">
              <Link to="/news" className="btn btn-primary btn-lg px-5 py-3 shadow">
                Get Today's News
              </Link>
              <Link to="/analyze" className="btn btn-outline-light btn-lg px-5 py-3 shadow">
                Analyze a Stock Now
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features py-5">
          <div className="container">
            <div className="row g-5 text-center">
              <div className="col-md-4">
                <div className="feature-card p-4 rounded-4 h-100">
                  <i className="bi bi-graph-up-arrow text-primary fs-1 mb-3"></i>
                  <h4 className="fw-bold">Trend Analysis</h4>
                  <p>Clear insights into stock direction and yearly performance.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card p-4 rounded-4 h-100">
                  <i className="bi bi-shield-check text-success fs-1 mb-3"></i>
                  <h4 className="fw-bold">Risk Evaluation</h4>
                  <p>Understand volatility and make safer investment decisions.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card p-4 rounded-4 h-100">
                  <i className="bi bi-newspaper text-info fs-1 mb-3"></i>
                  <h4 className="fw-bold">Market News</h4>
                  <p>Stay updated with the latest financial events and headlines.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home;