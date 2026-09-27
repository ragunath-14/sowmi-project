import './signin.css';
import {Link} from 'react-router-dom'
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';


const Signin = () => {
        const { backendUrl } = useStore();
        const [error,setError]=React.useState({});
        const [serverError,setServerError]=React.useState('');
        
        const [users,setUsers]=React.useState(
          {
          username:'',
          email:'',
          password:'',
          retypePassword:'',
          number:''
        }
        );
        const handleChange=(e)=>{
          setUsers({...users,[e.target.name]:e.target.value})
        }
        const validate = () => {
                  const errors = {};

                  // Username
                  if (!users.username.trim()) {
                    errors.username = "Username is required";
                  } else if (users.username.length < 3) {
                    errors.username = "Username must be at least 3 characters";
                  }

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

                  // Retype Password
                  if (!users.retypePassword.trim()) {
                    errors.retypePassword = "Please retype the password";
                  } else if (users.password !== users.retypePassword) {
                    errors.retypePassword = "Passwords do not match";
                  }

                  // Phone Number
                  if (!users.number.trim()) {
                    errors.number = "Phone number is required";
                  } else if (!/^[6-9]\d{9}$/.test(users.number)) {
                    errors.number = "Enter a valid 10-digit Indian mobile number";
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
                const response= await axios.post(`${backendUrl}/auth/signin`,users);
                if(response.status==201){
                  navigate('/login');
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
                  Create an Account
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
                          <label htmlFor="username" className="form-label">Username</label>
                          <input
                            id="username"
                            name="username"
                            type="text"
                            className="form-control input-hover"
                            placeholder="Create your Username"
                            value={users.username}
                            onChange={handleChange}
                          />
                          {error.username && (
                            <small className="text-danger">{error.username}</small>
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

                        <div className="mb-3">
                          <label htmlFor="retypePassword" className="form-label">Re-Type Password</label>
                          <input
                            id="retypePassword"
                            name="retypePassword"
                            type="password"
                            className="form-control input-hover"
                            placeholder="Re-type the Password"
                            value={users.retypePassword}
                            onChange={handleChange}
                          />
                          {error.retypePassword && (
                            <small className="text-danger">{error.retypePassword}</small>
                          )}
                        </div>

                        <div className="mb-3">
                          <label htmlFor="number" className="form-label">Mobile Number</label>
                          <input
                            id="number"
                            name="number"
                            type="text"
                            className="form-control"
                            placeholder="Enter your Mobile Number"
                            value={users.number}
                            onChange={handleChange}
                          />
                          {error.number && (
                            <small className="text-danger">{error.number}</small>
                          )}
                        </div>

                      <div className="d-grid mt-3">
                        <button className="btn btn-primary" type="sumbit" onClick={handleSumbit}>
                          Submit
                        </button>
                        {serverError && <small className='text-danger'>{serverError}</small>}
                      </div>

                      <div className='d-grid justify-content-center mt-3'>
                        <p>Already a User ? <Link to="/login">Login</Link></p>

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

export default Signin;
