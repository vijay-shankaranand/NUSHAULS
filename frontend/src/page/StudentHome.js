import React, {useEffect} from "react";
import { Link } from "react-router-dom";
import Homecard from "../component/Homecard"
import { useSelector, useDispatch } from "react-redux";
import { setDataProduct } from "../redux/productSlice";

const StudentHome = () => {
  const productData = useSelector((state=>state.product.productList))
  const homeProductCartList = productData
  console.log(productData)
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
      <div className="">
        <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Explore our <span className="text-amber-500">MarketPlace!</span></h2>
        </div>
        </div>

        <div className="flex p-10">
        <Link to="/myorders">
          <button className="absolute right-20 bg-amber-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
            My Orders
          </button>
          </Link>
          
        </div>

        <div className="flex flex-wrap gap-5 p-5 justify-center">
          {
            homeProductCartList[0] && homeProductCartList.map(el => {
              return (
                <Homecard
                key={el._id}
                id={el._id}
                image={el.image}
                name={el.name}
                price={el.price}
                />
              )
            })
          }
        </div>
      </div>
  )
}

export default StudentHome