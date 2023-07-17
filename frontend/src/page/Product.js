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
const [showModal, setShowModal] = useState(false); // State to control modal visibility


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
data.deliveryFee = deliveryEst.toFixed(2)
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
const handleVerification = () => {
  
  const {timeSlot} = data
  if (timeSlot) {
    if (userData.address === undefined || userData.number === undefined) {
      toast("Please fill up all additional details under My Profile section to start ordering!")
    } else {
    setShowModal(true);
    } 
  } else {
    toast("Enter Required Fields!")
  }
  
};

const handleConfirm = async(e) => {
  e.preventDefault()
  
  const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/uploadOrder`,{
    method : "POST",
    headers : {
      "content-type" : "application/json"
    },
    body : JSON.stringify(data)
  })

  const fetchRes =  await fetchData.json()

  
  toast.success(fetchRes.message)

  setData({
    product: "",
    timeSlot: "",
    state: "",
    timePlaced: "",
    timeState: "",
    residence: "",
    deliveryFee: "",
    user: "",
    deliverer: "",
    studentNumber: "",
  });
  setShowModal(false); // Hide the verification modal
  navigate("/myorders");
};

const handleCancel = () => {
  setShowModal(false); // Hide the verification modal
};

    return (
      
        <div className="">
          
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Product <span className="text-amber-500">Page</span></h2>
          </div>
          
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
            
            <div>
              <p className="text-slate-600 font-medium">Description : </p>
              <p>{productData[0] && productData.filter((el) => el._id === filterby)[0].description}</p>
            </div>
            <div>
              <p className="font-bold md:text-2xl text-xl pt-2 text-center">Delivery Information </p>
            </div>

            <div>
              <p className="text-slate-600 font-medium">Seller Location : </p>
              <p>{sellerLocation}</p>
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
    <div className="font-bold text-l pt-2">
            <p>
          Delivery fee: <span className="text-amber-500">$</span>{deliveryEst.toFixed(2)} ({deliveryEst.toFixed(2)/0.40} km from NUS)
        </p> 
          
            </div>   
    
    <div className="font-bold text-3xl pt-5">Grand Total: <span className="text-amber-500 ">$</span>{productData[0] && Number(productData.filter((el) => el._id === filterby)[0].price) + deliveryEst.toFixed(2)}</div>
    <div className="flex gap-3 pt-3">
        <button
          onClick={handleVerification}
          className="bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Place Order
        </button>
      </div>
      {/* Verification Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-md">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Confirmation</h2>
            <p className="font-medium">
            <span className="font-bold">Contact Number:</span> {userData.number}
            </p>
            <p className="pt-3 font-medium">
              <span className="font-bold">Hall of Stay:</span> {userData.address}
            </p>
            <p className="pt-5">
              <span className="text-red-500">*</span>Please correct your details in <span className="font-medium">My Profile</span> section if they are incorrect
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleConfirm}
                className="bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>
      )}
            
          </div>
        </div>
        <div className="pt-10">
            <div><span className="text-red-600">*</span>All products are cash on delivery</div>
            <div><span className="text-red-600">*</span>Delivery slot closes 1hr in advance to faciliate delivery process</div>
            <div><span className="text-red-600">*</span>Fare calculated based on approx distance ($0.40/km)</div>
        </div>
      </div>
      
      </div>
    
    )
  
}

export default Product