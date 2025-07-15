import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Check } from 'lucide-react';
import axios from 'axios';
import CryptoJS from "crypto-js";


export const ImageUpload = (props) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);


  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

   const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const id = props.id 

  const handleFileSelect = async (files) => {
    console.log('Files selected:', files[0]);
    const formData = new FormData();
    formData.append('profileImg', files[0]);


    try {
      setLoading(true);

      const res = await axios({
        method: 'post',
        url: `http://localhost:4000/api/v21/user/updateProfileImage?id=${id}`,
        data: formData
      });
      console.log('Upload successful:', res.data.data.user);

      // Encrypt the user data before storing it in localStorage
      const user = res.data.data.user;
      console.log(user);
      
      function encryptObject(obj, key) {
          const jsonString = JSON.stringify(obj);
          const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
          return encrypted;
        }

      //fetching old user data from local storage to update
      
      const encriptedUser = encryptObject(user, import.meta.env.VITE_SECRET_KEY);
        localStorage.setItem('user', encriptedUser)

      props.setOpenImageUpload(false);
      props.setUploadComplete(true); // Notify parent component about the update
     
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="text-center mb-8  ">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Images</h2>
        <p className="text-gray-600">Drag and drop your images or click to browse</p>
      </div>

      {/* UploadArea */}
      <div className={`rounded-[0.75rem] p-[1rem] text-center transition-all duration-300 cursor-pointer ${isDragOver ? 'border-[#3b82f6] bg-[#eff6ff] scale-105' : 'border-#d1d5db  hover:border-[#60a5fa] hover:bg-[#f9fafb]'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-2 rounded-[100%] transition-colors duration-300 ${isDragOver ? 'bg-[#dbeafe]' : 'bg-[#f3f4f6]'
            }`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-[#2563eb]' : 'text-[#4b5563]'}`} />
          </div>

          <div>
            <h3 className="text-[smaller] font-semibold text-[#1f2937] mb-1">
              {isDragOver ? 'Drop images here' : 'Choose images to upload'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or drag and drop them here
            </p>
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-gradient-to-r from-[#3b82f6] to-[#9333ea] text-white rounded-[.5rem] font-medium hover:from-[#2563eb] hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Select Images
          </button>
        </div>
      

        {loading && (
          <div className="absolute inset-0 h-full w-full top-[0px] left-[0px] flex items-center justify-center bg-white bg-opacity-50 rounded-[0.75rem]">
            <div className="animate-spin h-[2rem] w-[2rem] border-4 border-[#3b82f6] border-t-transparent rounded-full" ></div>
          </div>
        )}
      </div>
    </>
  )
}