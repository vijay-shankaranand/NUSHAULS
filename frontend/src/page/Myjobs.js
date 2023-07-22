import React, { useEffect, useState } from "react";import { useNavigate } from "react-router-dom";
import Ordercard, { getSelectedItems } from "../component/Ordercard";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';
import { setDataOrder } from "../redux/orderSlice";



const DeliveryPartnerHome = () => {
  const navigate = useNavigate();
  const productData = useSelector(state => state.product.productList);
  const orderData = useSelector(state => state.order.orderList);
  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [selectedState, setSelectedState] = useState("Accepted");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleVerification = () => {
    const itemIds = getSelectedItems();

    if (userData.number === undefined) {
      toast("Please fill up all additional details under My Profile section to accept orders!")
    } else {
    
    // Send the selected item IDs to the server for updating in MongoDB
    if (itemIds.length === 0) {
      toast("Please select at least 1 job to accept")
    } else {
      setShowModal(true);
      } 
    
  };
}

  const handleConfirm = () => {
    const itemIds = getSelectedItems();
    
    fetch(`${process.env.REACT_APP_SERVER_DOMIN}/orderDeliver`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ itemIds })
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server if needed
        itemIds.forEach(itemId => {
          // Define the push notification schema for student
          const order = orderData.find(order => order._id === itemId)
          const product = productData.find(product => product._id === order.product)
          const studentSchemaNotification = {
            orderId: itemId,
            productId: order.product, 
            productName: product.name, 
            timeSlot: order.timeSlot, 
            sellerId: "delivered",
            studentId: order.user,
            sellerViewed: true,
            studentViewed: false 
          };
  
          // Make the API call to push the notification for the student
          fetch(`${process.env.REACT_APP_SERVER_DOMIN}/pushNotification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(studentSchemaNotification)
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response from the server if needed
            })
            .catch(error => {
              // Handle any errors that occurred during the request
              console.error(error);
            });
            
        });


        setShowModal(false)
        toast("Order(s) Delivered")
        navigate("/myjobs")
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
    
    
  };

  const handleCancel = () => {
    setShowModal(false); // Hide the verification modal
  };


  useEffect(() => {
    const fulfillButton = document.getElementById("handleVerification");
    fulfillButton.addEventListener("click", handleVerification);

    return () => {
      fulfillButton.removeEventListener("click", handleVerification);
    };
  }, []);


  useEffect(() => {
    const fetchUpdatedOrderData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/order`);
        const data = await response.json();
        dispatch(setDataOrder(data)); // Dispatch action to update order data in the Redux store
      } catch (error) {
        console.error("Error fetching updated order data:", error);
      }
    };

    fetchUpdatedOrderData();
  }, [dispatch, orderData]);
  
  

  
  return (
    <div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold"> Your <span className="text-amber-500">Jobs</span></h2>
          </div>
          <form>
          <div className="flex p-10">
          <select
    value={selectedState}
    onChange={(e) => setSelectedState(e.target.value)}
    className="bg-white border border-gray-300 rounded px-3 py-1 mr-2"
  >
    <option value="">All Jobs</option>
    <option value="Accepted">Ongoing Jobs</option>
    <option value="Delivered">Completed Jobs</option>
  </select>
            
            <button id="handleVerification" type="button" className="absolute right-20 bg-green-500 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">Delivery Complete</button>
					  
            
          </div>
          
					<div className="p-5 flex flex-col-reverse">
          {
            orderData[0] &&
            orderData
              .filter((order) =>
                selectedState ? order.state === selectedState : true
              )
              .filter((order) =>
                order.deliverer === userData._id
              )
              .map(el => {
              return (
                <Ordercard
                key={el._id}
                id={el._id}
                image={productData[0] && productData.filter((product) => product._id === el.product)[0].image}
                name={productData[0] && productData.filter((product) => product._id === el.product)[0].name}
                price={productData[0] && productData.filter((product) => product._id === el.product)[0].price}
                region={productData[0] && productData.filter((product) => product._id === el.product)[0].region}
                timeSlot={el.timeSlot}
                state={el.state}
                timePlaced = {el.timePlaced}
                timeState = {el.timeState}
                residence= {el.residence}
                deliveryFee= {el.deliveryFee}
                user = {el.user}
                address = {productData[0] && productData.filter((product) => product._id === el.product)[0].address}
                number = {productData[0] && productData.filter((product) => product._id === el.product)[0].number}
                studentNumber = {el.studentNumber}
                
                />
              )
            })
    
            }
          
        </div>
        </form>
        <div>
          <p className="px-5 pb-5"><span className="text-red-600">*</span>Deliverer is entitled to full delivery amount</p>
        </div>
             {/* Verification Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-md">
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Confirmation</h2>
            <p>You are about to <span className="font-bold">complete</span> delivery of selected orders. Please ensure the following: </p>
            <p className="p-5 font-medium">1. Buyer has recieved his/her order</p>
            <p className="pl-5 font-medium">2. You have recieved your payment for the order upon delivery</p>
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
  )
}

export default DeliveryPartnerHome 