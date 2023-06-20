import React from "react";

import OrdercardStudent from "../component/OrdercardStudent"
import { useSelector } from "react-redux";


const Myorders = () => {
  const productData = useSelector((state=>state.product.productList))
  const orderData = useSelector((state=>state.order.orderList))
  const userData = useSelector((state=>state.user))
  

  console.log(productData)
  console.log(orderData)

  
  return (
    <div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">My <span className="text-amber-500">Orders</span></h2>
          </div>
          <div className="flex p-10">
            
            
          </div>
          
					<div className="p-5 flex flex-col-reverse">
          {
            orderData[0] && orderData.filter((order) => order.user === userData._id).map(el => {
              return (
                <OrdercardStudent
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
        <div>
          <p className="px-5 pb-5"><span className="text-red-600">*</span>Deliverer is entitled to full delivery amount</p>
        </div>
          
				</div>
  )
}

export default Myorders 