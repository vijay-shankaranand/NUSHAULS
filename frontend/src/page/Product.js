import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast'

const Product = () => {

const userData = useSelector((state) => state.user);    
const productData = useSelector((state=>state.product.productList))
const navigate = useNavigate();
const {filterby} = useParams()

const [data,setData] = useState({
  product : "",
  timeSlot : "",
  state : "",
  timePlaced : "",
  timeState : "",
  residence: "",
  deliveryFee: "",
  user : ""
})

const deliveryEst = 1.00;

data.product = filterby;
data.state = "Placed"
data.timePlaced = new Date().toLocaleTimeString()
data.timeState = new Date().toLocaleTimeString()
data.user = userData._id;
data.deliveryFee = deliveryEst;
console.log(data)

const options = [
    { label: '09:00', value: '09:00', time: '08:00' },
    { label: '12:00', value: '12:00', time: '11:00' },
    { label: '15:00', value: '15:00', time: '14:00' },
    { label: '18:00', value: '18:00', time: '17:00' },
    { label: '21:00', value: '21:00', time: '20:00' },
  ];

const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const handleOnChange = (e)=>{
  const {name,value} = e.target

  setData((preve)=>{
      return{
        ...preve,
        [name] : value
      }
  })

}

const handleSubmit = async(e)=>{
  e.preventDefault()

console.log(data)

  const {residence, timeSlot} = data

  if(residence , timeSlot){
    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/uploadOrder`,{
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
        product : "",
        timeSlot : "",
        state : "",
        timePlaced : "",
        timeState : "",
        residence: "",
        user : ""
      }
    })
    navigate("/myorders");
  }
  else{
    toast("Enter Required Fields")
  }
  
}
    return (
      
        <div className="">
          
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Product <span className="text-amber-500">Info</span></h2>
          </div>
          <form onSubmit={handleSubmit}>
        <div className="p-2 md:p-4">
        <div className="w-full max-w-4xl m-auto md:flex bg-slate-200 p-5">
          <div className="w-[400px] h-[500px] overflow-hidden w-full p-5">
            <img
              src={productData[0] && productData.filter((el) => el._id === filterby)[0].image}
              className="hover:scale-105 transition-all h-full" alt="loading"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-slate-600  capitalize text-2xl md:text-4xl">
              {productData[0] && productData.filter((el) => el._id === filterby)[0].name}
            </h3>
            <p className=" text-slate-500  font-medium text-2xl">{productData[0] && productData.filter((el) => el._id === filterby)[0].category}</p>
            <p className=" font-bold md:text-2xl">
              <span className="text-amber-500 ">$</span>
              <span>{productData[0] && productData.filter((el) => el._id === filterby)[0].price}</span>
            </p>   
            <div>
              <p className="text-slate-600 font-medium">Description : </p>
              <p>{productData[0] && productData.filter((el) => el._id === filterby)[0].description}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Region : </p>
              <p>{productData[0] && productData.filter((el) => el._id === filterby)[0].region}</p>
            </div>
            <label for="timeSlot" className="text-slate-600 font-medium">Choose a timeslot for delivery:</label> 
    <select className="bg-slate-200 border-solid border-2 rounded border-slate-600 p-2"
    name="timeSlot"
    id="timeSlot"
    value={data.timeSlot}
    onChange={handleOnChange}
    > 
    <option value="" selected disabled>Please Select</option> 
    {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.time < currentTime}>
          {option.label}
        </option>
      ))} 
    </select>
    <label for="residence" className="text-slate-600 font-medium">Residence:</label> 
    <select className="bg-slate-200 border-solid border-2 rounded border-slate-600 p-2"
    name="residence"
    id="residence" 
    value={data.residence}
    onChange={handleOnChange}> 
    <option value="" selected disabled>Please Select</option>
    <option value="KEVII">King Edward VII Hall</option>
    <option value="PGPR">Prince George's Park Residence</option>
    <option value="Temasek">Temasek Hall</option>
    <option value="Eusoff">Eusoff Hall</option>
    <option value="Raffles">Raffles Hall</option>
    <option value="Sheares">Sheares Hall</option>
    <option value="KentRidge">Kent Ridge Hall</option>
    <option value="UTR">UTown Residence</option>
    <option value="Tembusu">Tembusu College</option>
    <option value="CAPT">CAPT College</option>
    <option value="Cinnamon">Cinnamon College</option>
    <option value="RC4">RC4 College</option>

    </select>
    <div className="font-bold text-l pt-2">
    <p>Delivery fee: <span className="text-amber-500 ">$</span>{deliveryEst}</p>    
    </div>
    <div className="font-bold text-3xl pt-2">Grand Total: <span className="text-amber-500 ">$</span>{productData[0] && Number(productData.filter((el) => el._id === filterby)[0].price) + deliveryEst}</div>

            <div className="flex gap-3 pt-2">
          <button className="bg-yellow-500 py-1 mt-2 rounded hover:bg-yellow-600 min-w-[100px]">Place Order</button>
          
          </div>
          </div>
        </div>
        <div className="pt-20">
            <div><span className="text-red-600">*</span>All products are cash on delivery</div>
            <div><span className="text-red-600">*</span>Delivery slot closes 1hr in advance to faciliate delivery process</div>
            <div><span className="text-red-600">*</span>Fare calculated based on approx distance (temporarily $1)</div>
        </div>
      </div>
      </form>
      </div>
    
    )
  
}

export default Product