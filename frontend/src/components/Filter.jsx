import Form from 'react-bootstrap/Form';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useEffect, useState } from 'react';

export const Filter = (props) => {
  const [data , setData] = useState([])
  const [selectedData , setSelectedData] = useState([])
  const [searchItem , setSearchItem] = useState('')

const Filter = async()=>{

  await axios({
    method:'POST',
    url:`http://localhost:4000/api/v21/user/filteringName?searchitem=${searchItem}`
  })
  .then((res)=>{
      setData(res.data.data)
      
  })
}

const handleSearch = async (e) => {
  await axios({
    method:'POST',
    url:`http://localhost:4000/api/v21/user/ApplyNameFilter`,
    data: { selectedData: selectedData } 
  })
  .then((res)=>{
    console.log(res.data);
    props.setData(res.data.data);
    props.setIsFilterOpen(false);
  })
  .catch((error) => {
        console.error('Full error object:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);

  });
  
}




 const handleSelect = (item ,index) => {
    // Add to selected data
    setSelectedData(prev => [...prev, item]);
    
    // Remove from available data
    setData(prev => prev.filter(dataItem => dataItem !== item));
  };

  const handleDeselect = (selectedItem) => {
    // Remove from selected data
    setSelectedData(prev => prev.filter(item => item !== selectedItem));
    
    // Add back to available data
    setData(prev => [...prev, selectedItem]);
  };


useEffect(()=>{
  Filter()
},[])

  return (
    <div className="h-[26rem] w-[15rem]  flex flex-col absolute border-1 border-[#9ca3af] rounded-[.5rem] bg-white p-[1.2rem] " style={{ top: '21%', left: '18%' }}>
        <Form inline className="flex mb-2 w-[100%] ">
          <Form.Control type="search" placeholder="Search by Name" value={searchItem} className="mr-sm-2 w-[80%] " onChange={(e) => {setSearchItem(e.target.value) }} />

          <button className='w-[20%] h-[19%] bg-transparent border-1 border-[#e5e7eb] hover:bg-[#4c679f] rounded-[100%] object-cover ' style={{ marginLeft: '.5rem' }} onClick={(e) => {
            e.preventDefault()
            Filter()
          }}><Search />
          </button>
        </Form>

        <div className=" h-[22rem] flex flex-col gap-1 " style={{fontFamily:'sans-serif' , fontSize:'1.2rem'}}>
          <div className= {`h-[50%] flex flex-col overflow-y-scroll border-1 border-[#6b7280] p-[0.5rem] rounded-[.5rem] `}>
            
              <p className='text-center border-1 border-[#6b7280]'style={{fontSize:'small' , borderRadius:'1rem'}}>Selected Items{` (${selectedData.length})`}</p>
            {
              selectedData.length === 0 && <p className='text-center h-full w-full flex items-center justify-center 'style={{fontSize:'small'}}>No Selected Items</p>
            }
            {
          selectedData.map((item , index)=>(
           <form className=''  key={`selected-${index}`}>
            <label className='mr-[.5rem]' htmlFor={`selected-${index}`}>{item}</label>
            <input type="checkbox" checked={true} name="selected" id={`selected-${index}`} onChange={() => handleDeselect(item ,index)} />
           </form>
          ))
          }
          </div>
          <div className="max-h-fit flex flex-col overflow-y-scroll  border-1 border-[#6b7280] p-[0.5rem] rounded-[.5rem] ">
            <p className='text-center border-1 border-[#6b7280]' style={{fontSize:'small' , borderRadius:'1rem'}}>Available Items{` (${data.length})`}</p>
            {
              data.length === 0 && <p className='text-center h-full w-full flex items-center justify-center 'style={{fontSize:'small'}}>No Available Items</p>
            }
          {
          data.map((item , index)=>(
           <form key={item._id} className=''>
            <label className='mr-[.5rem]' htmlFor={index}>{item}</label>
            <input type="checkbox" checked={false} name="selected" id={item} onChange={() => handleSelect(item)}/>
           </form>
          ))
        }
        </div>
        </div>

        <div className="justify-self-end h-[15%] flex justify-around ">
          <button className='bg-black px-[.65rem] py-[.35rem] text-white text-center rounded-[.5rem] 'onClick={()=>{handleSearch()}}>Apply</button>
          <button className='bg-white border-1 border-black  px-[.65rem] py-[.35rem] text-center rounded-[.5rem] '
          onClick={()=>{props.setIsFilterOpen(false)}}>Cancel</button>
        </div>
    </div>
  )
}