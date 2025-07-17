import { Cookies } from "react-cookie";
import withAuth from "../HOC/Verify";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { validateEmail } from "../utils/validateEmail";
import CryptoJS from "crypto-js";
import { io } from "socket.io-client";

// ui-components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


// Assets
import add from '../assets/add1.png'
import searchimg from '../assets/search.png'
import clear from '../assets/clear.png'
import active from '../assets/active.png'
import deactive from '../assets/de-active.png'
import edit from '../assets/edit.png'
import { Funnel } from 'lucide-react';


// Components
import { ActivityLog } from "./Log";
import { Filter } from "./Filter";
import decryptObject from "../utils/decryptObject";


function Home() {
  const cookie = new Cookies
  const [data, setData] = useState([])
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editUserData, setEdituserData] = useState(null)
  const [search, setSearch] = useState(false)
  const [searchitem, setSearchitem] = useState('')
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef(null)
  const [isMsgOpen, setIsMsgOpen] = useState(false)
  const [msg , setMsg] = useState(null)
  const [filterStatus, setFilterStatus] = useState("reset");
  const [errLine , setErrLine] = useState(null)
  const [isValid , setIsValid] = useState(null)
  const [isNameFilterOpen , setIsFilterOpen] = useState(false)

  
  
  const encryptedId = localStorage.getItem('id')
  const bytes  = CryptoJS.AES.decrypt(encryptedId, import.meta.env.VITE_SECRET_KEY);
  const decryptId = bytes.toString(CryptoJS.enc.Utf8);
  const id = decryptId
  
  const encryptedData = localStorage.getItem('user')
  const LoggedInUser = decryptObject(encryptedData , import.meta.env.VITE_SECRET_KEY)
  
  
  const [isLogsOpen , setIsLogsOpen] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    fullName: false,
    userName: false,
    email: false,
    password: false,
  });
  
  function LogOut() {
    cookie.remove('accessToken')
    cookie.remove('refreshToken')
    location.reload()
  }


  // const statusCheckInterval = setInterval( async () =>{
  // await axios({
  //   method:'POST',
  //   url:'http://localhost:4000/api/v21/user/logoutIfUnverified',
  //   data:LoggedInUser
  // })
  // .then((res)=>{
  //   const data = res.data.data
  //   console.log(res.data);
    
  //   if(data.status){
  //     console.log(data.status);
  //     return
  //   }else{
  //     LogOut()
  //     clearInterval(statusCheckInterval)
  //   }
  // })
  // }, 2 * 60 * 1000)

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      query: { userId: id } // send user id to server
    });

    socket.on("logout", () => {
      LogOut();
    });

    // Optional: handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);
  

  const submit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);

    if (!form.fullName || !form.userName || !form.email || !form.password ) {
      setErrLine(false)
      setError({
        fullName: !form.fullName,
        userName: !form.userName,
        email: !form.email,
        password: !form.password,
      });
      if (form.email) {
        const emailValidationResult = validateEmail(form.email);
        setIsValid(emailValidationResult);
  
        if (!emailValidationResult) {
          setErrLine(true);
          return;
        }
      }
      return;
    }

    if (form.email) {
            const emailValidationResult = validateEmail(form.email);
            setIsValid(emailValidationResult);
      
            if (!emailValidationResult) {
              setErrLine(true);
              return;
            }
          }
    
      // Clear error line if email is valid
        setErrLine(false);

      
    // Sending data to the server
    await axios({
      method: 'POST',
      url: 'http://localhost:4000/api/v21/user/register',
      data: form
    })
      .then((res) => {
        console.log("Response from server:", res.data);
        setMsg(res.data.message)

        setIsMsgOpen(!isMsgOpen)
        setIsAddOpen(!isAddOpen)
        var NewUserId = res.data.data.id
        
        creatingActivityLog(NewUserId , 'Created')
        FetchData(1)
      })
      .catch((error) => {
        console.error("There was an error submitting the form!", error);
        setMsg(error.response.data.message)
        console.log(error.response.data.message);
        
        setIsMsgOpen(!isMsgOpen)
        setErrLine(false)
      })
      // .finally(()=>{
      //   setIsValid(false)
      // })
      

  };

  const editUser = async (e) => {
    e.preventDefault()
    console.log('update user');
    
    try {
      console.log(form);
      
      if (!form.fullName || !form.userName || !form.email ) {
      setErrLine(false)
      setError({
        fullName: !form.fullName,
        userName: !form.userName,
        email: !form.email,
      });
      if (form.email) {
        const emailValidationResult = validateEmail(form.email);
        setIsValid(emailValidationResult);
        console.log(emailValidationResult);
        
        if (!emailValidationResult) {
          setErrLine(true);
          return;
        }
      }
      return;
    }

    if (form.email) {
            const emailValidationResult = validateEmail(form.email);
            setIsValid(emailValidationResult);
      
            if (!emailValidationResult) {
              setErrLine(true);
              return;
            }
          }
    

      // Clear error line if email is valid
        setErrLine(false);

      await axios({
        method: 'POST',
        url: 'http://localhost:4000/api/v21/user/editUser',
        data: { form, editUserData }
      })
        .then((res) => {
          setMsg(res.data.message)
          setIsMsgOpen(true)

          console.log(res.data);
           // Safely update user data
        const id = res.data.data.user._id
            setData(prevData =>
                prevData.map(user =>
                    user._id === id ? { ...user, ...res.data.data.user } : user
                )
            );

          var NewUserId = res.data.data.user._id
          
          console.log('editUserData :',editUserData);
          creatingActivityLog(NewUserId , 'Updated' , editUserData)
          setIsEditOpen(false)
        })

    } catch (error) {
      console.error("There was an error submitting the form!", error);
      setMsg(error.response.data.message)
      setIsMsgOpen(!isMsgOpen)
    }
  }

  const creatingActivityLog = async (NewUserId , action , OldUserdata) =>{
    console.log( id , NewUserId );
    
    try {
      await axios({
        method:'POST',
        url:'http://localhost:4000/api/v21/Activity-log/Activitylog',
        data:{
           id : id,
           tableName : 'UsersInfo',
           recordId : NewUserId,
           action : action,
           OldUserdata : OldUserdata
          }
      })
      .then((res)=>{
        console.log(res.data);
        
      })
    } catch (error) {
      console.log(error);
      
    }
  }


  const FetchData = async (pageNum = 1 , filterStatus = 'reset') => {
    setLoading(true);
    console.log(filterStatus);
    
    await axios({
      method: search ? 'POST' : 'GET',
      url: search ? `http://localhost:4000/api/v21/user/searchUser?page=${pageNum}&limit=8` : `http://localhost:4000/api/v21/user/getAllUsers?page=${pageNum}&limit=8&filter=${filterStatus}`,
      data: search ? { searchitem: searchitem } : null
    })
      .then((res) => {
        console.log(res);
        console.log(res.data.data.length);

        if (res.data.data.length === 0) setHasMore(false);

        if (pageNum === 1) {
          setData(res.data.data.length === 0 ? [] : [...res.data.data]);
        } else {
          setData([...data, ...res.data.data])
        }

        
      })
      .catch((err) => {
        console.log("failed", err);
      })
      .finally(() => {
        setLoading(false)
        setHasMore(true)
      }
      );
  };

  const handleScroll = async (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;

    console.log(!loading , hasMore , '*',page ,scrollHeight - scrollTop - clientHeight);
    
    if (!loading && hasMore && scrollHeight - scrollTop - clientHeight < 100) {
      setPage(prev => prev + 1);
    }

  }

  const handleStatus = async (id) => {
    try {
      await axios({
        method: 'POST',
        url: 'http://localhost:4000/api/v21/user/SwitchStatus',
        data: { id }
      })
        .then((res) => {
          console.log(res, '*');
          // location.reload()
          setData(prevData =>
            prevData.map(user =>
              user._id === id ? { ...user, status: !user.status } : user
            )
          );
          const userstatus = res.data.data.status ? 'Actived' :'Blocked'
          creatingActivityLog( id , userstatus, true)
        })
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      alert(error.response.data.message)
    }
  }

  // Function to highlight text 
  // highlight = search term in the table
  const highlightText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} style={{ backgroundColor: '#ffe066', borderRadius: '4px' }}>{part}</span>
      ) : (
        part
      )
    );
  };

  const AskToVerify = async (email) => {
    try {
      setLoading(true)
      await axios({
        method:'POST',
        url:'http://localhost:4000/api/v21/user/VerifyingEmailLink',
        data: {email :email}
      })
      .then((res)=>{
        console.log(res.data);
        setMsg(res.data.message)
        setIsMsgOpen(!isMsgOpen)
      })
    } catch (error) {
        setMsg(error.response.data.message)
        setIsMsgOpen(!isMsgOpen)
    } finally{
        setLoading(false)
    }
  }

  useEffect(() => {
    
    FetchData(page , filterStatus);
    console.log(filterStatus);
    console.log('fetchdata run',filterStatus);
    
  }, [page, search, searchitem])

  return (
    <div className="bg-[#f5f5f5] h-[93.20vh] w-[99vw] flex flex-col overflow-hidden ">

      <div className="w-full h-[10%] flex justify-between bg-white shadow-md rounded-lg  items-center" style={{ padding: '1.5rem' }}>
        <div className="w-[50%]  flex items-center mx-2 ">
          <Form inline className="flex h-[2rem] w-[80%] " style={{width:'max-content'}}>
            <Form.Control type="search" placeholder="Search by Name" className="mr-sm-2 " style={{width:'50%'}} onChange={(e) => { setSearchitem(e.target.value) }} />

            <Button variant="dark" size="sm" style={{ width: 'max-content', marginRight: '', marginLeft: '.5rem' ,display:'flex' , alignItems:'center' }} onClick={(e) => {
              setSearch(true)
              setPage(1)
              if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
              }
            }}>
              Search
              <img
                src={searchimg}
                alt="Search"
                style={{ width: '1.2rem', height: '1.2rem', marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}
              />
              </Button>

            <Button variant="light" className="border border-black flex" style={{ width: 'max-content', marginLeft:'.5rem' }} onClick={() => { location.reload() }}>Clear
              <img
                src={clear}
                alt="clear"
                style={{ width: '1.2rem', height: '1.2rem', marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}
              />
            </Button>
          </Form>

        </div>

        <div className="flex items-center">

          <Button className="m-[1rem] " onClick={()=>{setIsLogsOpen(true)}}>Activity Logs</Button>

          <DropdownButton id="dropdown-basic-button" title="Filter" style={{marginRight:'1rem'}} >
            <Dropdown.Item onClick={()=>{ FetchData(1) }}>All</Dropdown.Item>
            <Dropdown.Item onClick={()=>{ setPage(1),setFilterStatus('active') , FetchData(1, 'active')  }}>Active</Dropdown.Item>
            <Dropdown.Item onClick={()=>{ setPage(1) ,setFilterStatus('deactive'),FetchData(1 ,'deactive')  }}>InActive</Dropdown.Item>
            <Dropdown.Item onClick={()=>{ setPage(1) , setFilterStatus('Verified') ,FetchData(1,'Verified')   }}>Verified</Dropdown.Item>
            <Dropdown.Item onClick={()=>{ setPage(1) , setFilterStatus('UnVerified'),FetchData(1 , 'UnVerified')   }}>UnVerified</Dropdown.Item>
          </DropdownButton>

          <Button style={{
              marginRight: '2rem',
              borderRadius: '0.5rem',
            }}
            onClick={() => {
              setForm({
                fullName: '',
                userName: '',
                email: '',
                password: '',
              })
              setError({
                fullName: false,
                userName: false,
                email: false,
                password: false,
              });
              setIsAddOpen(!isAddOpen);
            }}
          >
            Add
            <img
              src={add}
              alt="Add"
              style={{ width: '1.5rem', marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}
            />
          </Button>

        </div>
        

      </div>

      <div ref={scrollRef} className=" overflow-x-hidden  object-cover border border-black overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300" style={{ margin: '2rem', borderRadius: '1rem',  }} onScroll={handleScroll}>
        <table className="w-[96vw] bg-white shadow-md rounded-lg  text-center " style={{ borderRadius: '1rem' }} >
          <thead>
            <tr className="bg-blue-600 text-black text-center border ">
              <th className="py-3 px-6 text-center border border-black">Sr. No.</th>
              <th className="py-3 px-6 text-center border border-black"
              onClick={()=>{setIsFilterOpen(true)}}>Name 
                    <Funnel/>
              </th>
              <th className="py-3 px-6 text-center border border-black">Username</th>
              <th className="py-3 px-6 text-center border border-black">Email</th>
              <th className="py-3 px-6 text-center border border-black">Edit</th>
              <th className="py-3 px-6 text-center border border-black">Status</th>
              <th className="py-3 px-6 text-center border border-black">Is Verified</th>
            </tr>
          </thead>
          <tbody>
            
            {data
              .map((item, id) => (
                <tr key={id} className={`border ${id % 2 === 0 ? 'bg-[#f3f4f6]' : 'bg-[#ffffff]'} m-[1rem]`}>
                  <td className="py-3 px-6  text-center border border-black">{id + 1}</td>
                  <td className="py-3 px-6 text-center border border-black">
                    {highlightText(item.fullName, searchitem)}
                  </td>
                  <td className="py-3 px-6 text-center border border-black">{item.userName}</td>
                  <td className="py-3 px-6 text-center border border-black">{item.email}</td>
                  <td className="py-3 px-6 text-center border border-black">
                    <button
                      id={id}
                      className="h-[2.5rem] w-[2.5rem] bg-transparent border-none"
                      onClick={(e) => {
                        const user = data[e.currentTarget.id];
                        setIsEditOpen(!isEditOpen);
                        setEdituserData(user);
                        setForm({
                          fullName: user.fullName || "",
                          email: user.email || "",
                          userName: user.userName || "",
                          password:''
                        });
                      }}
                    >
                      <img
                        className="h-full w-full object-cover"
                        src={edit}
                        alt="edit"
                      />
                    </button>
                  </td>
                  <td className="text-center border border-black">
                    {item.status ? (
                      <button
                        // variant="success"
                        className="bg-[#3ea771] border-none px-[1rem] py-[.5rem] text-white rounded-[3rem]"
                        onClick={(e) => handleStatus(item._id)}
                      >
                        Active
                        <img
                          src={active}
                          alt="Active"
                          style={{
                            width: '1.2rem',
                            height: '1.2rem',
                            marginLeft: '0.5rem',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      </button>
                    ) : (
                      <button
                        // variant="danger"
                        className="bg-[#c94d4d] border-none px-[1rem] py-[.5rem] text-white rounded-[3rem]"
                        onClick={(e) => handleStatus(item._id)}
                      >
                        InActive
                        <img
                          src={deactive}
                          alt="de-active"
                          style={{
                            width: '1.2rem',
                            height: '1.2rem',
                            marginLeft: '0.5rem',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                          }}
                        />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center border border-black">{item.isVerified ? (
                      <button
                         className="bg-[#3ea771] border-none px-[1rem] py-[.5rem] text-white rounded-[3rem]"
                      >
                        Verified
                        <img
                          src={active}
                          alt="Active"
                          style={{
                            width: '1.2rem',
                            height: '1.2rem',
                            marginLeft: '0.5rem',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                          }}
                        />
                      </button>
                    ) : (
                      <button
                         className="bg-[#c94d4d] border-none px-[1rem] py-[.5rem] text-white rounded-[3rem]"
                        onClick={() => {
                          AskToVerify(item.email)
                          
                        }}
                      >
                        Ask to Verify
                        <img
                          src={deactive}
                          alt="de-active"
                          style={{
                            width: '1.2rem',
                            height: '1.2rem',
                            marginLeft: '0.5rem',
                            display: 'inline-block',
                            verticalAlign: 'middle'
                          }}
                        />
                      </button>
                    )}</td>
                </tr>
              ))}
            
          </tbody>
        </table>
      </div>


      {/* User edit Form code */}
      <div className={`${isEditOpen ? 'visible' : 'hidden'} h-screen w-screen absolute inset-0 bg-white bg-opacity-50 backdrop-blur-3xl z-40`} style={{ pointerEvents: 'auto' }}>
        <div className={` h-[70%] w-[40%] border-black border absolute bg-white flex flex-col items-center  `} style={{ borderRadius: '2rem', gap: '1rem', top: '12%', right: '30%' }}>
          <h2 className="m-3">Edit User Information</h2>

          <form className=" flex flex-col w-[75%]  " style={{ gap: '1rem' }} >

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.fullName}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                onClick={() => { setError({ ...error, fullName: true }); }}
              />
              <div className={`${!form.fullName && form.fullName !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Name is required
              </div>
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                UserName
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={form.userName}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                onClick={() => { setError({ ...error, userName: true }); }}
              />
              <div className={`${!form.userName && form.userName !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! UserName is required
              </div>
            </div>


            {/* email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 ">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value })
                 
                }}
                 onClick={() => { setError({ ...error, email: true }); }}
              />

              {error.email && (
              <div className={`${!form.email ? 'visible' : 'hidden'} ${!errLine ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Email is required
              </div>
            )}
            <div className={`${errLine ? 'visible' : 'hidden'} h-[1rem] w-[20rem] text-[#d62626]`}>
              Invalid Email! Enter Correct email
            </div>

            </div>

            <div className="flex items-center gap-4">
              <Button variant="dark" size="sm" className="self-center " type='submit' style={{ width: '8rem' }}
                onClick={editUser} >Update</Button>

              <Button variant="dark" size="sm" className="self-center " type='submit' style={{ width: '8rem' }}
                onClick={(e) => {
                  e.preventDefault()
                  setIsEditOpen(!isEditOpen)
                }} >Cancel</Button>
            </div>

          </form>
        </div>
      </div>


      {/* user Add form code */}
      <div className={`${isAddOpen ? 'visible' : 'hidden'} h-screen w-screen absolute inset-0 bg-white bg-opacity-50 backdrop-blur-3xl z-40`} style={{ pointerEvents: 'auto' }}>
        <div className={` h-[80%] w-[40%] border-black border absolute bg-white flex flex-col items-center  `} style={{ borderRadius: '2rem', gap: '1rem', top: '12%', right: '30%' }}>
          <h2 className="m-3">Add User Information</h2>

          <form className=" flex flex-col w-[75%]  " style={{ gap: '1rem' }} >

            <div>
              <label htmlFor="nameAdd" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="nameAdd"
                name="name"
                value={form.fullName}
                required
                
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                onClick={()=>{ setError({...error , fullName: true }) }}
              />
              { 
                error.fullName && (
                  <div className={`${!form.fullName && form.fullName !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                  ! Name is required
                   </div>
                )
              }
              
            </div>



            <div>
              <label htmlFor="userNameAdd" className="block text-sm font-medium text-gray-700">
                UserName
              </label>
              <input
                type="text"
                id="userNameAdd"
                name="userName"
                value={form.userName}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => setForm({ ...form, userName: e.target.value })}
                 onClick={()=>{ setError({...error , userName: true }) }}
              />
              {
                error.userName && (
                  <div className={`${!form.userName && form.userName === '' ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! UserName is required
                  </div>
                )
              }
            </div>


            {/* email */}
            <div>
              <label htmlFor="emailAdd" className="block text-sm font-medium text-gray-700 ">
                Email
              </label>
              <input
                type="email"
                id="emailAdd"
                name="email"
                value={form.email}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value })
                }}
                 onClick={()=>{ setError({...error , email: true }) }}
              />
              {error.email && (
              <div className={`${!form.email ? 'visible' : 'hidden'} ${!errLine ? 'visible' : 'hidden'} text-[#d62626]`}>
                ! Email is required
              </div>
            )}
            <div className={`${errLine ? 'visible' : 'hidden'} h-[1rem] w-[20rem] text-[#d62626]`}>
              Invalid Email! Enter Correct email
            </div>

            </div>
            <div>
              <label htmlFor="passwordAdd" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="passwordAdd"
                name="password"
                value={form.password}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                 onClick={()=>{ setError({...error , password: true }) }}
              />
              {
                error.password && (
                  <div className={`${!form.password && form.password !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! password is required
                  </div>
                )
              }
            </div>

            <div className="flex items-center gap-4">
              <Button variant="dark" size="sm" className="self-center " type='submit' style={{ width: '8rem' }}
                onClick={submit} >Add</Button>
              <Button variant="dark" size="sm" className="self-center " style={{ width: '8rem' }}
                onClick={() => {
                  setIsAddOpen(!isAddOpen)
                }} >Cancel</Button>
            </div>

          </form>
        </div>
      </div>

       {/* Message Box */}
       <div className={`${isMsgOpen ? 'visible' : 'hidden'} h-screen w-screen absolute inset-0  bg-opacity-20 backdrop-blur-[12px] z-40`} style={{ pointerEvents: 'auto' }}>
          <div className={`h-[15rem] w-[20rem] border border-black absolute top-[35%] left-[35%] bg-white flex flex-col items-center justify-center rounded-[1rem]`}>
            <p>{msg}</p>
            <Button variant="dark" size="sm" className="self-center " style={{ width: '8rem' }}
                onClick={() => {
                  setIsMsgOpen(!isMsgOpen)
                  
                }} >Ok</Button>
          </div>
        </div>


        {/* Activity logs */}
        {isLogsOpen && 
          <div className={`overflow-y-scroll h-screen w-screen fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-[4px] `} style={{ pointerEvents: 'auto' , top:'10%'}}>
          <ActivityLog setIsLogsOpen={setIsLogsOpen}/>
         </div>
        }

        
      <div className={`${isNameFilterOpen ? 'visible' : 'hidden'} h-screen w-screen absolute `} style={{ pointerEvents: 'auto' }}>
          <Filter setIsFilterOpen={setIsFilterOpen} setData={setData}/>
      </div>


      {loading && (
          <div className="absolute inset-0 h-full w-full top-[0px] bottom-[0px] flex items-center justify-center bg-white bg-opacity-50 rounded-[0.75rem]">
            <div className="animate-spin h-[2rem] w-[2rem] border-4 border-[#3b82f6] border-t-transparent rounded-full" ></div>
          </div>
        )}

    </div>
  )
}

export default withAuth(Home);