import './signin.css';
import {Link} from 'react-router-dom'
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Login = () => {
  const { backendUrl, setToken } = useStore();
  const [error,setError]=React.useState({});
  const [serverError,setServerError]=React.useState('');
        
        const [users,setUsers]=React.useState(
          {
          email:'',
          password:'',
        }
        );
        const handleChange=(e)=>{
          setUsers({...users,[e.target.name]:e.target.value})
        }
        const validate = () => {
                  const errors = {};

                 
                  // Email
                  if (!users.email.trim()) {
                    errors.email = "Email is required";
                  } else if (!/^\S+@\S+\.\S+$/.test(users.email)) {
                    errors.email = "Invalid email format";
                  }

                  // Password
                  if (!users.password.trim()) {
                    errors.password = "Password is required";
                  } else if (users.password.length < 6) {
                    errors.password = "Password must be at least 6 characters";
                  }

                  setError(errors);

                  return Object.keys(errors).length === 0;
                };
                const navigate=useNavigate();
               const handleSumbit=async(e)=>{
              e.preventDefault();
              try{
                if(!validate()) return ;
                console.log(users)
                const response= await axios.post(`${backendUrl}/auth/login`,users);
                if(response.status==200){
                  setToken(response.data.token);  // saves to context + localStorage
                  navigate('/home');
              }
            }
              catch(err){ 
                console.log(err)
                setServerError(err.response?.data?.message || err.message || "Login failed");
              }

            }

  return (
    <>
      <div className="container">
        {/* HEADER */}
        <div className="row">
          <div className="card bg-dark shadow">
            <h2 className="text-center text-light p-3">
              Intelligent Stock Market Forecasting System
            </h2>
          </div>
        </div>

        {/* FORM */}
        <div className="row mt-5 justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">

                <h4 className="text-center mb-3">
                  Login Your Account
                </h4>

                <form className="p-2">

                  <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control input-hover"
                            placeholder="Enter your Email"
                            value={users.email}
                            onChange={handleChange}
                          />
                          {error.email && (
                            <small className="text-danger">{error.email}</small>
                          )}
                      </div>

                  
                  
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control input-hover"
                            placeholder="Create a Strong Password"
                            value={users.password}
                            onChange={handleChange}
                          />
                          {error.password && (
                            <small className="text-danger">{error.password}</small>
                          )}
                        </div>

                  <div className="d-grid mt-3">
                    <button className="btn btn-primary" onClick={handleSumbit}>
                      Login
                    </button>
                  </div>
                  <div className='d-grid justify-content-center mt-3'>
                    <p>New User ? <Link to="/signin">Create Account</Link></p>
                    {serverError && (<small className='text-danger'>{serverError}</small>)}
                  </div>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
