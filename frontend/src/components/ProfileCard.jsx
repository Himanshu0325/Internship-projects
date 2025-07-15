import React, { useEffect , useState} from 'react';
import decryptObject from '../utils/decryptObject';
import { Camera , X} from 'lucide-react';
import ImageUploadForm from './UploadImage';
import { ImageUpload } from './ImageUpload';

const ProfileCard = (props) => {
  const [profileData, setProfileData] = useState({})
  const [show, setShow] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const fetchUserProfile = async () => {
    const secretKey = import.meta.env.VITE_SECRET_KEY;
    const encrypted = localStorage.getItem('user');
    const decrypted = decryptObject(encrypted, secretKey);
    console.log(decrypted);
    
    setProfileData(decrypted);
  };

  useEffect(() => {
   fetchUserProfile();
   console.log('Profile data fetched:', profileData);
   
  }, [props.openProfile]);

  useEffect(() => {
    if (uploadComplete) {
      // Small delay to ensure localStorage is updated
      setTimeout(() => {
        fetchUserProfile()
        console.log('Upload complete, fetching fresh data');
        
        // Notify parent component (Navbar) to update
        if (props.onProfileUpdate) {
          props.onProfileUpdate();
        }
        
        setUploadComplete(false);
      }, 100);
    }
  }, [uploadComplete]);

  return (
    <>
      <div className={`${props.openProfile ? 'visible' : 'hidden'} absolute max-w-[28rem] z-30 mx-auto bg-white rounded-[0.75rem] shadow-md overflow-hidden md:max-w-[32rem]`} style={{ top: '4rem', right: '2rem' }}>
        <div className="md:flex">
          <div className="md:shrink-0">
            <img
              className="h-[12rem] w-full object-cover md:h-full md:w-[12rem]"
              src={profileData.profileImg || "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7da51373-9a6b-42d9-b30f-8f0b553f2405.png"}
              alt="Professional headshot of the user with a clean background"
            />
            <div className="absolute h-[12rem] w-full hover:bg-black flex items-center justify-center " style={{ top: '0', transition: 'background-color 0.3s ease' }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; setShow(true); }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent', setShow(false) }}
            >
              <div className={`${show ? 'visible' : 'hidden'} h-[2rem] w-[2rem] rounded-[100%]`}  >
                <Camera className={`${show ? 'visible' : 'hidden'} text-white h-full w-full`} onClick={()=>{setOpenImageUpload(true), props.setOpenProfile(false)}} />

              </div>

            </div>
          </div>
          <div className="p-[2rem]">

            <div className="block mt-[0.25rem] text-[1.125rem] leading-tight font-medium text-[#000000]">{profileData.fullName}</div>
            <div className="mt-[0.5rem] text-[#6b7280]">@{profileData.userName}</div>
            <div className="mt-[1rem] flex items-center">
              <svg className="h-[1.25rem] w-[1.25rem] text-[#6b7280]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="ml-[0.5rem] text-[#4b5563]">{profileData.email}</span>
            </div>
            <div className="mt-[1.5rem]">
              <button className="px-[1rem] py-[0.5rem] text-[0.875rem] text-[#ffffff] bg-[#6366f1] rounded-[0.25rem] hover:bg-[#5855eb] focus:outline-none focus:ring-[0.125rem] focus:ring-[#6366f1] focus:ring-offset-[0.125rem]" onClick={props.handleAuth}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${openImageUpload? 'visible':'hidden'} bg-white h-[20rem] w-[20rem] absolute border-1 border-[#6b7280] rounded-[0.75rem] `}  style={{top:'25%' , padding:'1rem' }} >
        <ImageUpload id={profileData._id} setOpenImageUpload={setOpenImageUpload} setUploadComplete={setUploadComplete} />

        <X className='absolute top-[.7rem] right-[.7rem] ' onClick={()=>{setOpenImageUpload(false)}}/>
      </div>

    </>
  );
};

export default ProfileCard;