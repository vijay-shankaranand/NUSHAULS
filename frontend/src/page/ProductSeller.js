import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";


const ProductSeller = () => {

 
const productData = useSelector((state=>state.product.productList))

const {filterby} = useParams()

    return (
      
        <div className="">
          
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Product <span className="text-amber-500">Info</span></h2>
          </div>
          
        <div className="p-2 md:p-4">
        <div className="w-full max-w-4xl m-auto p-5">
          <div className="w-[400px] h-[500px] w-full pb-5">
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
          </div>
          <div className="flex gap-3 pt-2 pt-3">
          <button className="bg-rose-600 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded">Delete</button>
          <button className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">Edit</button>  
          </div>
        </div>
        
      </div>

      
      
      </div>
    
    )
  
}

export default ProductSeller