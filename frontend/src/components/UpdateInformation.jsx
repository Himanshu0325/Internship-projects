import { useEffect, useState } from "react";
import { fetchUserProfile } from "../utils/fetchUserProfile";
import { validateEmail } from "../utils/validateEmail.js";
import axios from "axios";


// ui-components
import Button from 'react-bootstrap/Button';
import { PasswordStrengthChecker } from "./passwordStrengthChecker.jsx";

export const UpdateInformation = () => {
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({})
  const [isMsgOpen, setIsMsgOpen] = useState(false)
  const [msg, setMsg] = useState(null)
  const [errLine, setErrLine] = useState(null)
  const [isValid, setIsValid] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [IsPassMatched , setIsPasswordMatched] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    currentPassword: '',
    password: '',
    conformpassword: '',
    userId: ''
  });
  const [error, setError] = useState({
    fullName: false,
    userName: false,
    email: false,
    password: false,
    currentPassword: false,
    conformpassword: false,
  });

  const fillInputFeild = async () => {
    const data = await fetchUserProfile()
    console.log(data);

    setForm({
      fullName: data.fullName,
      userName: data.userName,
      email: data.email,
      userId: data._id,
    })
  }

  const editUser = async (e) => {

    console.log('update user');

    try {
      console.log(form);

      if (!form.fullName || !form.userName || !form.email) {
        setErrLine(false)
        setError({
          fullName: true,
          userName: true,
          email: true,
        });
        if (form.email) {
          const emailValidationResult = validateEmail(form.email);
          setIsValid(emailValidationResult);

          if (!emailValidationResult) {
            console.log('inside if', emailValidationResult);

            setErrLine(true)
            return
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
        data: { form }
      })
        .then((res) => {
          setMsg(res.data.message)
          setIsMsgOpen(true)

          console.log(res.data);
          // Safely update user data


        })

    } catch (error) {
      console.error("There was an error submitting the form!", error);
      setMsg(error.response.data.message)
      setIsMsgOpen(!isMsgOpen)
    }
  }

  const UpdatePassword = async () => {

    if (form.password !== form.conformpassword) {
      return setIsPasswordMatched(true)
    }
    setIsPasswordMatched(false)

    await axios({
      method: 'POST',
      url: 'http://localhost:4000/api/v21/user/updatePassword',
      data: form
    })
      .then((res => {
        console.log(res);
        setForm({
          currentPassword: '',
          password: '',
          conformpassword: '',
        })
        setError({
          fullName: false,
          userName: false,
          email: false,
          password: false,
          currentPassword: false,
          conformpassword: false,
        })
        setMsg(res.data.message)
        setIsMsgOpen(true)
      }))
      .catch((error)=>{
        console.log(error);
        setMsg(error.response.data.message)
        setIsMsgOpen(true)
      })
  }


  const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
  };

  const handlePasswordStrengthChange = (strength) => {
    setPasswordStrength(strength);
  };

  useEffect(() => {
    fillInputFeild()
  }, [])

  const toggleInfoModal = () => { setShowInfoModal(true), setShowPasswordModal(false) };
  const togglePasswordModal = () => { setShowPasswordModal(true), setShowInfoModal(false) };
  return (
    <div className="h-screen w-screen flex  ">

      <div className="h-screen w-[25%] rounded-[1rem] border-1 bg-[#ebe9e9] ">
        <div className="action-card  rounded-lg overflow-hidden">
          <div className="p-[1.5rem]">
            <h2 className="text-[1.25rem] font-semibold text-[#1f2937] mb-[1rem]">Account Actions</h2>

            <div className="space-y-[1rem] ">
              <button
                onClick={toggleInfoModal}
                className="w-full flex items-center justify-between px-[1rem]  h-[3rem] rounded-[.75rem] bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1f2937] transition-colors"
              >
                <span className="font-medium">Update Profile Information</span>
                <svg className="w-[1.25rem] h-[1.25rem] text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="divider h-[1px] w-full"></div>

              <button
                onClick={togglePasswordModal}
                className="w-full flex items-center justify-between px-[1rem] h-[3rem] rounded-[.75rem] bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1f2937] transition-colors"
              >
                <span className="font-medium">Change Password</span>
                <svg className="w-[1.25rem] h-[1.25rem] text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="divider h-[1px] w-full"></div>

              <button
                onClick={() => { location.replace('/home') }}
                className="w-full flex items-center justify-between px-[1rem]  h-[3rem] rounded-[.75rem] bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1f2937] transition-colors"
              >
                <span className="font-medium">Exit</span>
                <svg className="w-[1.25rem] h-[1.25rem] text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-screen w-[75%] flex justify-center items-center bg-[#f5f5f5] ">
        {/* Update Info Modal */}
        {showInfoModal && (
          <div className="inset-0 flex items-center justify-center z-[50]  bg-opacity-50" style={{ margin: 'auto' }}>
            <div className="bg-[#ffffff] rounded-[1rem] p-[1.5rem] w-[38rem]    border-1 border-black ">
              <h3 className="text-[1.125rem] font-semibold text-[#1f2937] mb-[1rem]  justify-self-center ">Update Profile Information</h3>

              <div className="space-y-[1rem] w-[25rem] justify-self-center ">
                <div>
                  <label className="block text-[0.875rem] font-medium text-[#374151] mb-[0.25rem]">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-[0.75rem] py-[0.5rem] h-[2.5rem] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#3b82f6]"
                    value={form.fullName}
                    onChange={(e) => { setForm({ ...form, fullName: e.target.value }) }}
                    onClick={() => { setError({ ...error, fullName: true }); }}
                  />
                  <div className={`${!form.fullName && form.fullName !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! Name is required
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-[#374151] mb-[0.25rem]">User Name</label>
                  <input
                    type="text"
                    className="w-full px-[0.75rem] py-[0.5rem] h-[2.5rem] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#3b82f6]"
                    value={form.userName}
                    onChange={(e) => { setForm({ ...form, userName: e.target.value }) }}
                    onClick={() => { setError({ ...error, userName: true }); }}
                  />
                  <div className={`${!form.userName && form.userName !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! UserName is required
                  </div>
                </div>

                <div>
                  <label className="block text-[0.875rem] font-medium text-[#374151] mb-[0.25rem]">Email</label>
                  <input
                    type="email"
                    className="w-full px-[0.75rem] py-[0.5rem] h-[2.5rem] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#3b82f6]"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }) }}
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

                <div className="flex justify-self-center space-x-[0.75rem] pt-[0.5rem]">
                  <button
                    onClick={toggleInfoModal}
                    className="px-[1rem] py-[0.5rem] h-[2.5rem] text-[#374151] mr-[3rem] rounded-md border-1 border-[#5c5d5f] hover:bg-[#f9fafb]"
                  >
                    Cancel
                  </button>
                  <button className="px-[1rem] py-[0.5rem] h-[2.5rem] bg-[#3b82f6] text-[#ffffff] rounded-md hover:bg-[#2563eb]"
                    onClick={() => { editUser() }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Password Modal */}
        {showPasswordModal && (
          <div className=" inset-0 flex items-center justify-center z-[50]  bg-opacity-50">
            <div className="bg-[#ffffff] rounded-[1rem] p-[1.5rem] w-[38rem]    border-1 border-black  ">
              <h3 className="text-[1.125rem] font-semibold text-[#1f2937] mb-[1rem] justify-self-center">Change Password</h3>

              <div className="space-y-[1rem] w-[25rem] justify-self-center">
                <div>
                  <label className="block text-[0.875rem] font-medium text-[#374151] mb-[0.25rem]">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-[0.75rem] py-[0.5rem] h-[2.5rem] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#3b82f6]"
                    value={form.currentPassword}
                    onChange={(e) => { setForm({ ...form, currentPassword: e.target.value }) }}
                    onFocus={() => { setError({ ...error, currentPassword: true }); }}
                  />
                  {error.currentPassword && (

                  <div className={`${!form.currentPassword && form.currentPassword !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! currentPassword is required
                  </div>
                    )}
                </div>
                

                {/* <div>
                  <label className="block text-[0.875rem] font-medium text-[#374151] mb-[0.25rem]">New Password</label>
                  <input
                    type="password"
                    className="w-full px-[0.75rem] py-[0.5rem] h-[2.5rem] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#3b82f6]"
                    value={form.password}
                    onChange={(e) => { setForm({ ...form, password: e.target.value }) }}
                    onClick={() => { setError({ ...error, password: true }); }}
                  />
                  <div className={`${!form.password && form.password !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! password is required
                  </div>
                </div> */}
                <PasswordStrengthChecker
                  password={form.password}
                  onPasswordChange={handlePasswordChange}
                  onStrengthChange={handlePasswordStrengthChange}
                  showError={error.password}
                  onFocus={() => { setError({ ...error, password: true }); }}
                />

                <div>
                  <label className="block text-[0.875rem] font-medium text-[#374151] mb-[0.25rem]">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-[0.75rem] py-[0.5rem] h-[2.5rem] border border-[#d1d5db] rounded-md focus:outline-none focus:ring-[2px] focus:ring-[#3b82f6]"
                    value={form.conformpassword}
                    onChange={(e) => { setForm({ ...form, conformpassword: e.target.value }) }}
                    onFocus={() => { setError({ ...error, conformpassword: true }); }}
                  />
                  {error.conformpassword && (
                      
                  <div className={`${!form.conformpassword && form.conformpassword !== '' && form.conformpassword !== undefined ? 'visible' : 'hidden'} text-[#d62626]`}>
                    ! conformpassword is required
                  </div>
                      )}
                      
                  <div className={`${form.conformpassword !== form.password ? !form.conformpassword && form.conformpassword !== undefined ? 'hidden' : 'visible' : 'hidden'} text-[#d62626]`}>
                    ! confirm password must matched with password
                  </div>
                </div>

                <div className="flex justify-end space-x-[0.75rem] pt-[0.5rem]j  justify-self-center">
                  {/* <button
                    onClick={togglePasswordModal}
                    className="px-[1rem] py-[0.5rem] h-[2.5rem] text-[#374151] mr-[3rem] rounded-md border border-[#d1d5db] hover:bg-[#f9fafb]"
                  >
                    Cancel
                  </button> */}
                  <button className="px-[1rem] py-[0.5rem] h-[2.5rem] bg-[#3b82f6] text-[#ffffff] rounded-md hover:bg-[#2563eb]"
                  onClick={UpdatePassword}>
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Message Box */}
      <div className={`${isMsgOpen ? 'visible' : 'hidden'} h-screen w-screen absolute inset-0  bg-opacity-20 backdrop-blur-[12px] z-60`} style={{ pointerEvents: 'auto' }}>
        <div className={`h-[15rem] w-[20rem] border border-black absolute top-[35%] left-[35%] bg-white flex flex-col items-center justify-center rounded-[1rem]`}>
          <p>{msg}</p>
          <Button variant="dark" size="sm" className="self-center " style={{ width: '8rem' }}
            onClick={() => {
              setIsMsgOpen(!isMsgOpen)
              console.log(form);
              
            }} >Ok</Button>
        </div>
      </div>
    </div>
  )
}

