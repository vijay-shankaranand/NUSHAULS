import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {BsCloudUpload} from "react-icons/bs"
import { ImagetoBase64 } from '../utility/ImagetoBase64'
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const Newproduct = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [data,setData] = useState({
    name : "",
    category : "",
    image : "",
    price : "",
    description : "",
    user : "",
    region: ""
  })

  data.user = userData._id

  const towns = [
    "Ang Mo Kio",
    "Bedok",
    "Bishan",
    "Boon Lay",
    "Bukit Batok",
    "Bukit Merah",
    "Bukit Panjang",
    "Bukit Timah",
    "Central Water Catchment",
    "Changi",
    "Changi Bay",
    "Choa Chu Kang",
    "Clementi",
    "Downtown Core",
    "Geylang",
    "Hougang",
    "Jurong East",
    "Jurong West",
    "Kallang",
    "Lim Chu Kang",
    "Mandai",
    "Marina East",
    "Marina South",
    "Marine Parade",
    "Museum",
    "Newton",
    "Novena",
    "Orchard",
    "Outram",
    "Pasir Ris",
    "Paya Lebar",
    "Pioneer",
    "Punggol",
    "Queenstown",
    "River Valley",
    "Rochor",
    "Seletar",
    "Sembawang",
    "Sengkang",
    "Serangoon",
    "Simpang",
    "Singapore River",
    "Southern Islands",
    "Sungei Kadut",
    "Tampines",
    "Tanglin",
    "Tengah",
    "Toa Payoh",
    "Tuas",
    "Western Islands",
    "Western Water Catchment",
    "Woodlands",
    "Yishun"
  ]

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
          description : "",
          user : '',
          region: ''
        }
      })
      navigate("/seller-home");
    }
    else{
      toast("Enter required Fields")
    }
    
  }

  return (
<div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Add New <span className="text-amber-500">Product</span></h2>
          </div>
    <div className="p-4">
       <form className='m-auto w-full max-w-md  shadow flex flex-col p-2' onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type={"text"}  name="name" className='bg-slate-200 p-1 my-1' onChange={handleOnChange} value={data.name} maxlength="20"/>

        <label htmlFor='category'>Category</label>
        <select className='bg-slate-200 p-2 my-2' id='category' name='category' onChange={handleOnChange} value={data.category}>
          <option value='' selected disabled>Select Category</option>
          <option value={"Edibles"}>Food & Snacks</option>
          <option value={"Household"}>Household</option>
          <option value={"Medical"}>Medical</option>
          <option value={"Misc"}>Misc</option>
        </select>

        <label htmlFor='image'>Image
        <div  className='h-60 w-full bg-slate-200  rounded flex items-center justify-center cursor-pointer'>
            {
              data.image ? <img src={data.image} className="h-full" alt=""/> :<span className='text-5xl'><BsCloudUpload/></span> 
            }
            
            
           <input type={"file"} accept="image/*" id="image" onChange={uploadImage} className="hidden"/>
        </div>
        </label>

        <label className="pt-3" htmlFor='Region'>Region</label>
        <select className='bg-slate-200 p-2 my-2' id='region' name='region' onChange={handleOnChange} value={data.region}>
          <option value='' selected disabled>Select Region</option>
          {towns.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
        </select>
        

        <label htmlFor='price' className='my-1'>Price</label>
        <input type={"text"} className='bg-slate-200 p-1 my-1' name='price' onChange={handleCurrency} value={data.price} placeholder="$"/>

        <label htmlFor='description'>Description</label>
        <textarea rows={2} value={data.description} className='bg-slate-200 p-1 my-1 resize-none' name='description' onChange={handleOnChange}></textarea>
        <button className='bg-amber-500 hover:bg-blue-800 text-white text-lg font-medium my-2 drop-shadow p-2'>Upload</button>
        
        
       </form>
    </div>
    </div>
  )
}

export default Newproduct