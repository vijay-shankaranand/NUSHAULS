import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {BsCloudUpload} from "react-icons/bs"
import { ImagetoBase64 } from '../utility/ImagetoBase64'
import { Link, useNavigate } from "react-router-dom";

const Newproduct = () => {
  const navigate = useNavigate();
  const [data,setData] = useState({
    name : "",
    category : "",
    image : "",
    price : "",
    description : ""
  })

  const handleOnChange = (e)=>{
    const {name,value} = e.target

    setData((preve)=>{
        return{
          ...preve,
          [name] : value
        }
    })

  }

  const handleCurrency = (e) => {
    const {name,value} = e.target
    // Regex to match only numeric values with up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === '') {
      setData((preve)=>{
        return{
          ...preve,
          [name] : value
        }
    })
    }
  };

  const uploadImage = async(e)=>{
    if (e.target.files[0]) {
      const data = await ImagetoBase64(e.target.files[0])
      console.log(data)
    

      setData((preve)=>{
        return{
          ...preve,
          image : data
        }
      })
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log(data)

    const {name,image,category,price} = data

    if(name && image && category && price){
      const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/uploadProduct`,{
        method : "POST",
        headers : {
          "content-type" : "application/json"
        },
        body : JSON.stringify(data)
      })
  
      const fetchRes =  await fetchData.json()
  
      console.log(fetchRes)
      toast(fetchRes.message)

      setData(()=>{
        return{
          name : "",
          category : "",
          image : "",
          price : "",
          description : ""
        }
      })
      navigate("/seller-home");
    }
    else{
      toast("Enter required Fields")
    }
    
  }

  return (
    <div className="p-4">
        <h1 className="m-auto w-full max-w-md flex-col px-30 text-2xl py-10 text-center bg-amber-200">New Product</h1>
       <form className='m-auto w-full max-w-md  shadow flex flex-col p-2' onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type={"text"}  name="name" className='bg-slate-200 p-1 my-1' onChange={handleOnChange} value={data.name} maxlength="20"/>

        <label htmlFor='category'>Category</label>
        <select className='bg-slate-200 p-2 my-2' id='category' name='category' onChange={handleOnChange} value={data.category}>
          <option value='' selected disabled>Select Category</option>
          <option value={"food"}>Food&Snacks</option>
          <option value={"household"}>Household</option>
          <option value={"medical"}>Medical</option>
          <option value={"misc"}>Misc</option>
        </select>

        <label htmlFor='image'>Image
        <div  className='h-60 w-full bg-slate-200  rounded flex items-center justify-center cursor-pointer'>
            {
              data.image ? <img src={data.image} className="h-full" /> :<span className='text-5xl'><BsCloudUpload/></span> 
            }
            
            
           <input type={"file"} accept="image/*" id="image" onChange={uploadImage} className="hidden"/>
        </div>
        </label>
        

        <label htmlFor='price' className='my-1'>Price</label>
        <input type={"text"} className='bg-slate-200 p-1 my-1' name='price' onChange={handleCurrency} value={data.price} placeholder="$"/>

        <label htmlFor='description'>Description</label>
        <textarea rows={2} value={data.description} className='bg-slate-200 p-1 my-1 resize-none' name='description' onChange={handleOnChange}></textarea>
        <button className='bg-amber-500 hover:bg-blue-800 text-white text-lg font-medium my-2 drop-shadow p-2'>Upload</button>
        
        
       </form>
    </div>
  )
}

export default Newproduct