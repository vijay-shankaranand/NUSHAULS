import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import Homecard from "../component/Homecard"
import { useSelector, useDispatch } from "react-redux";
import { setDataProduct } from "../redux/productSlice";

const SellerHome = () => {
  const productData = useSelector((state=>state.product.productList))
  const homeProductCartList = productData
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
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

    fetchProductData();
  }, [dispatch]);
  
  
  
  return (
    <div className="">
					
          <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Your <span className="text-amber-500">Products</span></h2>
          </div>
          <div className="flex p-10">
            <Link to="/newproduct">
            <button className="absolute right-20 bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">+ New Product</button>
					  </Link>
          </div>
					<div className="flex flex-wrap gap-5 p-5 justify-center">
          {
            homeProductCartList[0] && homeProductCartList.filter((product) => product.user === userData._id).map(el => {
              return (
                <Homecard
                key={el._id}
                id={el._id}
                image={el.image}
                name={el.name}
                price={el.price}
                category={el.category}
                />
              )
            })
          }
        </div>
          
				</div>
  )
}

export default SellerHome