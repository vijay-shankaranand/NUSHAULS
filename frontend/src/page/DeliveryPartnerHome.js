import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Ordercard from "../component/Ordercard"
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast'

const DeliveryPartnerHome = () => {
  const userData = useSelector((state) => state.user);
  const productData = useSelector((state=>state.product.productList))
  const navigate = useNavigate();
  
  
  
  return (
    <div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold"> Orders</h2>
          </div>
          <div className="flex p-10">
            <Link to="/orderjobs">
            <button className="absolute right-20 bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">My Jobs</button>
					  </Link>
          </div>
          
					<div className="flex flex-wrap gap-5 p-5 justify-center">
          {
            
    
            }
          
        </div>
          
				</div>
  )
}

export default DeliveryPartnerHome 