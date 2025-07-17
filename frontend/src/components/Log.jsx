import React, {forwardRef, useImperativeHandle, useEffect, useState , useRef} from "react";

import logout from '../assets/logout.png'
import axios from "axios";

export const ActivityLog = ({ setIsLogsOpen }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activityLogData, setActivityLogData] = useState([])
  const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const scrollRef = useRef(null)
  
  const activityData = [
    {
      id: 1,
      title: 'Code Deployment',
      description: 'Deployed the latest version to staging environment for testing.',
      time: 'Yesterday',
      icon: 'deploy',
      color: '#10b981',
      bgColor: '#d1fae5',
      darkBgColor: '#059669',
      category: 'Created',
    },
    {
      id: 2,
      title: 'Bug Fixing Session',
      description: 'Resolved critical issues reported by QA team in the authentication flow.',
      time: '2 days ago',
      icon: 'bug',
      color: '#ef4444',
      bgColor: '#fee2e2',
      darkBgColor: '#dc2626',
      category: 'Updated',
    },

  ];



  const filteredActivities = activityLogData
  
  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'calendar':
        return (
          <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'design':
        return (
          <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case 'deploy':
        return (
          <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
        );
      case 'bug':
        return (
          <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'team':
        return (
          <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        );
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const filterOptions = [
    { key: 'all', label: 'All Activities', color: '#6366f1' },
    { key: 'Created', label: 'Created', color: '#10b981' },
    { key: 'Updated', label: 'Updated', color: '#FFBF00' },
    { key: 'Actived', label: 'Active', color: '#3b82f6' },
    { key: 'Blocked', label: 'Inactive', color: '#FF0000' },
  ];

  const getActionConfig = (action) => {
  switch(action) {
    case 'Created':
      return {
        icon: 'team',
        color: '#10b981',
        bgColor: '#d1fae5',
        darkBgColor: '#059669'
      };
    case 'Updated':
      return {
        icon: 'bug',
        color: '#FFBF00',
        bgColor: '#FDFD96',
        darkBgColor: '#dc2626'
      };
    case 'Blocked':
      return {
        icon: 'bug',
        color: '#FF0000',
        bgColor: '#FFCCCB',
        darkBgColor: '#dc2626'
      };
    case 'Actived':
      return {
        icon: 'bug',
        color: '#3b82f6',
        bgColor: '#ADD8E6',
        darkBgColor: '#dc2626'
      };
    }
  }

  const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.abs(now - date) / 36e5;
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    // return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
};

  const FetchData = async (pageNum = 1 , filterStatus = 'all')=>{
    
      setLoading(true)
      await axios({
        method:'GET',
        url:`http://localhost:4000/api/v21/Activity-log/FetchALLActivityLogs?page=${pageNum}&limit=8&filter=${filterStatus}`,
      })
      .then((res)=>{
        console.log(res.data.data);
        if (res.data.data.length === 0) setHasMore(false);

        if (res.data.data && Array.isArray(res.data.data)) {
          const FormattedData = res.data.data.map((item, index) => {
            const actionConfig = getActionConfig(item.action);
            console.log(actionConfig,item.action);
            
            return {
              id: index + 1,
              title: `${item.action} `,
              description: `${item.action} operation performed on ${item.table_name} by ${item.performedBy || 'Unknown User'}`,
              time: formatTime(item.updatedAt || item.createdAt || item.timestamp),
              icon: actionConfig.icon,
              color: actionConfig.color,
              bgColor: actionConfig.bgColor,
              darkBgColor: actionConfig.darkBgColor,
              category: item.action,
              performedBy: item.performedBy,
              changedField: item.changedField || [],
              // rawData: item // Keep original data for debugging
            };

          })

          if (pageNum === 1) {
            console.log('inside if');
            
          setActivityLogData(FormattedData);
        } else {
            console.log('inside else');
            
          setActivityLogData([ ...activityLogData , ...FormattedData])

        }

          // setActivityLogData(FormatedData);
          console.log(FormattedData);
        }
        
      })
      .catch((err)=>{
        console.log(err);
        
      })
      .finally(()=>{
        setLoading(false)
        setHasMore(true)
      })
      
  
    
  }

  
  

  const handleScroll = async (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
  
      console.log(!loading , hasMore , '*',page ,scrollHeight - scrollTop - clientHeight);
      
      if (!loading && hasMore && scrollHeight - scrollTop - clientHeight < 100) {
        setPage(prev => prev + 1);
      }
  
    }
  
  useEffect(()=>{
    FetchData(page , activeFilter )
  },[page ])
  
  return (
    <div className={`h-full transition-all overflow-y-scroll duration-[400ms] ${darkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`} onScroll={handleScroll}>
      <div className="max-w-[64rem] mx-auto px-[1rem] py-[2rem] md:px-[2rem]">
        {/* Header */}
        <div className="flex justify-between items-center mb-[2rem]">
          <div>
            <h1 className={`text-[2rem] font-bold mb-[0.5rem] ${darkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              Activity Log
            </h1>
            <p className={`text-[1rem] ${darkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
              Track your project activities and team progress
            </p>
          </div>
          
          {/* <button 
            onClick={toggleDarkMode}
            className={`p-[0.75rem] rounded-[1rem] transition-all duration-[300ms] hover:scale-105 ${
              darkMode 
                ? 'bg-[#1e293b] text-[#f1f5f9] hover:bg-[#334155] shadow-lg' 
                : 'bg-[#ffffff] text-[#1e293b] hover:bg-[#f1f5f9] shadow-md'
            }`}
            style={{ boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
            {darkMode ? (
              <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-[1.25rem] h-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button> */}
          <button className={`p-[0.75rem] rounded-[1rem] transition-all duration-[300ms] hover:scale-105 ${
              darkMode 
                ? 'bg-[#1e293b] text-[#f1f5f9] hover:bg-[#334155] shadow-lg' 
                : 'bg-[#ffffff] text-[#1e293b] hover:bg-[#f1f5f9] shadow-md'
            }
            `}
            onClick={()=>{setIsLogsOpen(false)}}>
                <img className="h-[2rem] object-cover " src={logout} alt="" />
          </button>
        </div>
        
        {/* Filter Buttons */}
        <div className="mb-[2rem] flex flex-wrap gap-[0.75rem]">
          {filterOptions.map((filter) => (
            <button 
              key={filter.key}
              // onClick={() => setActiveFilter(filter.key)}
              onClick={()=>{ 
                FetchData(1 , filter.key)
                setPage(1)
                setActiveFilter(filter.key)
              }}
              className={`px-[1rem] py-[0.5rem] rounded-[2rem] text-[0.875rem] font-medium transition-all duration-[300ms] hover:scale-105 ${
                activeFilter === filter.key 
                  ? 'text-white shadow-lg' 
                  : darkMode 
                    ? 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]' 
                    : 'bg-[#ffffff] text-[#64748b] hover:bg-[#f1f5f9]'
              }`}
              style={{ 
                backgroundColor: activeFilter === filter.key ? filter.color : undefined,
                boxShadow: activeFilter === filter.key 
                  ? `0 4px 6px -1px ${filter.color}40` 
                  : darkMode 
                    ? '0 2px 4px -1px rgba(0, 0, 0, 0.3)' 
                    : '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className={`absolute left-[1.5rem] top-0 bottom-0 w-[2px] ${darkMode ? 'bg-[#334155]' : 'bg-[#e2e8f0]'}`}></div>
          
          <div className="space-y-[2rem] pb-[5rem] ">
            {filteredActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="relative group"
                style={{ animationDelay: `${index * 100}ms`  }}
              >
                {/* Timeline Icon */}
                <div 
                  className="absolute left-0 top-[1rem] w-[3rem] h-[3rem] rounded-[1rem] flex items-center justify-center text-white shadow-lg transition-all duration-[300ms] group-hover:scale-110"
                  style={{ backgroundColor: activity.color }}
                >
                  {getIconComponent(activity.icon)}
                </div>
                
                {/* Activity Card */}
                <div className="ml-[4.5rem]">
                  <div className={`p-[1.5rem] rounded-[1rem] transition-all duration-[300ms] hover:translate-y-[-2px] ${
                    darkMode 
                      ? 'bg-[#1e293b] border border-[#334155] shadow-lg' 
                      : 'bg-[#ffffff] border border-[#e2e8f0] shadow-md'
                  }`}
                  style={{ 
                    boxShadow: darkMode 
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  >
                    <div className="flex justify-between items-start mb-[0.75rem]">
                      <h3 className={`text-[1.125rem] font-semibold ${darkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
                        {activity.title}
                      </h3>
                      <span 
                        className="text-[0.75rem] px-[0.75rem] py-[0.25rem] rounded-[1rem] font-medium"
                        style={{ 
                          backgroundColor: darkMode ? activity.darkBgColor + '20' : activity.bgColor,
                          color: activity.color 
                        }}
                      >
                        {activity.time}
                      </span>
                    </div>
                    
                    <p className={`text-[0.875rem] mb-[1rem] leading-[1.5] ${darkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
                      {activity.description}
                    </p>
                    
                    {/* User Info */}
                    <div className="flex items-center">
                      
                      <div className="ml-[0.75rem]">
                        {/* show username when a user is updated but the username is not changed */}
                        {
                          activity.changedField.map((item, index) => {
                            if( activity.title === 'Updated ' && item.label === 'userName' && !item.newvalue){
                             return <p key={index} className={`${index % 2 === 0 ? 'bg-[#e0d8f2]' : 'bg-[#86b0eb]'} ${index % 2 === 0 ? 'text-[#6a53a0]' : 'text-[#4775b5]'} p-[.35rem]  rounded-[0.5rem] m-[3px] border-1 border[#9ca3af]`} style={{width:'max-content'}}>{item.label} → {item.value}</p>
                            }
                          })}
                        
                        {/* show what is changed and which user is added */}
                          {activity.changedField.map((item, index) => (

                            activity.title === 'Updated ' && item.newvalue ?
                            <>
                            <p key={index+1} className={`${index % 2 === 0 ? 'bg-[#e0d8f2]' : 'bg-[#86b0eb]'} ${index % 2 === 0 ? 'text-[#6a53a0]' : 'text-[#4775b5]'} p-[.35rem]  rounded-[0.5rem] m-[3px] border-1 border[#9ca3af] `} style={{width:'max-content'}}>
                              {item.label} → {activity.title === 'Updated ' ?  ('From  ') :'' } { item.value  }
                              { activity.title === 'Updated ' && `  to   ${item.newvalue} `}
                            </p> 
                            </>
                             
                            : 
                            activity.title === 'Created ' && 
                            <p key={index} className={`  ${index % 2 === 0 ? 'bg-[#e0d8f2]' : 'bg-[#86b0eb]'} ${index % 2 === 0 ? 'text-[#6a53a0]' : 'text-[#4775b5]'} p-[.35rem]  rounded-[0.5rem] m-[3px] border-1 border[#9ca3af]`} style={{width:'max-content'}}>
                              {item.label} → { item.value  }
                            </p>

                            
                          ))}

                          {activity.changedField.map((item, index) => {
                            if(activity.title === "Blocked " ){
                              return <p key={index+2} className={`${index % 2 === 0 ? 'bg-[#e0d8f2]' : 'bg-[#86b0eb]'} ${index % 2 === 0 ? 'text-[#6a53a0]' : 'text-[#4775b5]'} p-[.35rem]  rounded-[0.5rem] m-[3px] border-1 border[#9ca3af] `} style={{width:'max-content'}}>
                                  {item.label === 'Status' ?`${item.label}  → Changed Status from Active to ${item.value} `  : `${item.label}  → ${item.value}`} 
                              </p>
                            }
                          })}

                          {activity.changedField.map((item, index) => {
                            if(activity.title === "Actived " ){
                              return <p key={index+3} className={`${index % 2 === 0 ? 'bg-[#e0d8f2]' : 'bg-[#86b0eb]'} ${index % 2 === 0 ? 'text-[#6a53a0]' : 'text-[#4775b5]'} p-[.35rem]  rounded-[0.5rem] m-[3px] border-1 border[#9ca3af] `} style={{width:'max-content'}}>
                                {item.label === 'Status' ?`${item.label}  → Changed Status from InActive to ${item.value} `  : `${item.label}  → ${item.value}`}
                              </p>
                            }
                          })}

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Empty State */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-[4rem]">
            <svg className={`w-[4rem] h-[4rem] mx-auto mb-[1rem] ${darkMode ? 'text-[#475569]' : 'text-[#94a3b8]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className={`text-[1.125rem] font-medium mb-[0.5rem] ${darkMode ? 'text-[#f1f5f9]' : 'text-[#1e293b]'}`}>
              No activities found
            </h3>
            <p className={`text-[0.875rem] ${darkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
              Try adjusting your filter to see more activities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}