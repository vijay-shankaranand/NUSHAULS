import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  user : "",
  deliverer:"",
  studentNumber:""
})
console.log(productData)
const sellerLocation = productData.find((product) => product._id === filterby)?.address;
console.log(sellerLocation)
const buyerLocation = "National University of Singapore, 21 Lower Kent Ridge Road, Singapore 119077";

const [deliveryEst, setDeliveryEst] = useState(0);

const calculateDistance = () => {
  if (!sellerLocation) return;
  const geocoder = new window.google.maps.Geocoder();
  const origin = sellerLocation;
  const destination = buyerLocation;
  

  geocoder.geocode({ address: origin }, (results, status) => {
    if (status === 'OK' && results.length > 0) {
      const originLatLng = results[0].geometry.location;
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          const destinationLatLng = results[0].geometry.location;
          const distanceService = new window.google.maps.DistanceMatrixService();
          distanceService.getDistanceMatrix(
            {
              origins: [originLatLng],
              destinations: [destinationLatLng],
              travelMode: 'DRIVING',
            },
            (response, status) => {
              if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                const distanceValue = response.rows[0].elements[0].distance.value;
                const distanceInKm = distanceValue / 1000;
                const fee = distanceInKm * 0.4;
                setDeliveryEst(fee);
              } else {
                toast.error('Error calculating distance');
              }
            }
          );
        } else {
          toast.error('Error geocoding destination');
        }
      });
    } else {
      toast.error('Error geocoding origin');
    }
  });
};

useEffect(() => {
  calculateDistance();
}, [sellerLocation]);

if (!sellerLocation) {
  return <div>Loading...</div>; 
}

data.product = filterby;
data.state = "Available"
data.timePlaced = new Date().toLocaleTimeString()
data.timeState = new Date().toLocaleTimeString()
data.user = userData._id;
data.deliveryFee = deliveryEst;
data.residence = userData.address;
data.studentNumber = userData.number;


const options = [
    { label: '09:00', value: '09:00', time: '08:00' },
    { label: '12:00', value: '12:00', time: '11:00' },
    { label: '15:00', value: '15:00', time: '14:00' },
    { label: '18:00', value: '18:00', time: '17:00' },
    { label: '21:00', value: '21:00', time: '20:00' },
    { label: '24:00', value: '24:00', time: '23:00' },
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

  if (userData.address === undefined || userData.number === undefined) {
    toast("Please fill up all additional details under My Profile section to start ordering!")
  } else {

  const {timeSlot} = data

  if(timeSlot){
    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/uploadOrder`,{
      method : "POST",
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(data)
    })

    const fetchRes =  await fetchData.json()

    
    toast.success(fetchRes.message)

    setData(()=>{
      return{
        product : "",
        timeSlot : "",
        state : "",
        timePlaced : "",
        timeState : "",
        residence: "",
        user : "",
        deliverer: "",
        studentNumber: ""
      }
    })
    navigate("/myorders");
  }
  else{
    toast("Enter Required Fields")
  }
}
  
}
    return (
      
        <div className="">
          
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Product <span className="text-amber-500">Info</span></h2>
          </div>
          <form onSubmit={handleSubmit}>
        <div className="p-2 md:p-4">
        <div className="w-full max-w-4xl m-auto p-5">
          <div className="w-[400px] h-[500px]  w-full pb-5 ">
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
            <div className="font-bold text-l">
            <p>
          Delivery fee: <span className="text-amber-500">$</span>{deliveryEst.toFixed(2)} (Distance : {deliveryEst/0.4} km)
        </p>     
            </div>   
            <div>
              <p className="text-slate-600 font-medium">Description : </p>
              <p>{productData[0] && productData.filter((el) => el._id === filterby)[0].description}</p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Region : </p>
              <p>{productData[0] && productData.filter((el) => el._id === filterby)[0].region}</p>
            </div>
            <label for="timeSlot" className="text-slate-600 font-medium">Choose a timeslot for delivery:</label> 
    <select className="bg-slate-100 border-solid border-2 rounded border-slate-600 p-2"
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
    
    <div className="font-bold text-3xl pt-5">Grand Total: <span className="text-amber-500 ">$</span>{productData[0] && Number(productData.filter((el) => el._id === filterby)[0].price) + deliveryEst.toFixed(2)}</div>

            <div className="flex gap-3 pt-3">
          <button className="bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">Place Order</button>
          
          </div>
          </div>
        </div>
        <div className="pt-10">
            <div><span className="text-red-600">*</span>All products are cash on delivery</div>
            <div><span className="text-red-600">*</span>Delivery slot closes 1hr in advance to faciliate delivery process</div>
            <div><span className="text-red-600">*</span>Fare calculated based on approx distance ($0.4/km)</div>
        </div>
      </div>
      </form>
      </div>
    
    )
  
}

export default Product