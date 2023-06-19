import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Ordercard from "../component/Ordercard"
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast'

const Myorders = () => {
  const userData = useSelector((state) => state.user);
  const productData = useSelector((state=>state.product.productList))
  const navigate = useNavigate();
  
  
  
  return (
    <div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Your<span className="text-amber-500"> Orders</span></h2>
          </div>
          
					<div className="flex flex-wrap gap-5 p-5 justify-center">
          {
            
    
            }
          
        </div>
          
				</div>
  )
}

export default Myorders