import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Ordercard, { getSelectedItems } from "../component/Ordercard";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';
import { setDataOrder } from "../redux/orderSlice";
import { setDataProduct } from "../redux/productSlice";


const DeliveryPartnerHome = () => {
  const navigate = useNavigate();
  const productData = useSelector(state => state.product.productList);
  const orderData = useSelector(state => state.order.orderList);
  const userData = useSelector(state => state.user);
  const dispatch = useDispatch();

  const fulfillItems = () => {
    const itemIds = getSelectedItems();
    const delivererId = userData._id;
    console.log(delivererId)
    // Send the selected item IDs to the server for updating in MongoDB
    if (itemIds.length === 0) {
      toast("Please select at least 1 order to accept")
    } else {
    fetch(`${process.env.REACT_APP_SERVER_DOMIN}/orderAccept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ itemIds, delivererId })
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the server if needed
        console.log(data);
        toast("Order(s) accepted successfully")
        navigate("/myjobs")
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
    }
  };

  useEffect(() => {
    const fulfillButton = document.getElementById("fulfillButton");
    fulfillButton.addEventListener("click", fulfillItems);

    return () => {
      fulfillButton.removeEventListener("click", fulfillItems);
    };
  }, []);

  useEffect(() => {
    // Fetch order data asynchronously
    const fetchOrderData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/order`);
        const data = await response.json();
        dispatch(setDataOrder(data)); // Dispatch action to update order data in the Redux store
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    // Fetch product data asynchronously
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/product`);
        const data = await response.json();
        dispatch(setDataProduct(data)); // Dispatch action to update product data in the Redux store
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchOrderData();
    fetchProductData();
  }, [dispatch]);
  

  
  return (
    <div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold"> Orders <span className="text-amber-500">Available</span></h2>
          </div>
          <form>
          <div className="flex p-10">
            
            <button id="fulfillButton" type="button" className="absolute right-20 bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">Accept</button>
					  
            <Link to="/myjobs">
            <button className="absolute left-20 bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded">My jobs</button>
					  </Link>
            
          </div>
          
					<div className="p-5 flex flex-col-reverse">
          {
            orderData[0] && orderData.filter((order) => order.state === "Available").map(el => {
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
                />
              )
            })
    
            }
          
        </div>
        </form>
        <div>
          <p className="px-5 pb-5"><span className="text-red-600">*</span>Deliverer is entitled to full delivery amount</p>
        </div>
          
				</div>
  )
}

export default DeliveryPartnerHome 