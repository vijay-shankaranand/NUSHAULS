import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Homecard from "../component/Homecard"
import { useSelector, useDispatch } from "react-redux";
import { setDataProduct } from "../redux/productSlice";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const StudentHome = () => {
  const productData = useSelector((state=>state.product.productList))
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 5000]);
  
  const homeProduct = productData
  .filter((product) => (selectedRegion ? product.region === selectedRegion : true))
  .filter((product) => (selectedCategory ? product.category === selectedCategory : true))
  .filter((product) => {
    if (!selectedPriceRange || selectedPriceRange.length !== 2) {
      return true; // If no price range is selected, include all products
    }
    const [minPrice, maxPrice] = selectedPriceRange;
    return product.price >= minPrice && product.price <= maxPrice;
  });
  const towns = [
    "Ang Mo Kio",
    "Bedok",
    "Bishan",
    "Boon Lay",
    "Bukit Batok",
    "Bukit Merah",
    "Bukit Panjang",
    "Bukit Timah",
    "Central Water Catchment",
    "Changi",
    "Changi Bay",
    "Choa Chu Kang",
    "Clementi",
    "Downtown Core",
    "Geylang",
    "Hougang",
    "Jurong East",
    "Jurong West",
    "Kallang",
    "Lim Chu Kang",
    "Mandai",
    "Marina East",
    "Marina South",
    "Marine Parade",
    "Museum",
    "Newton",
    "Novena",
    "Orchard",
    "Outram",
    "Pasir Ris",
    "Paya Lebar",
    "Pioneer",
    "Punggol",
    "Queenstown",
    "River Valley",
    "Rochor",
    "Seletar",
    "Sembawang",
    "Sengkang",
    "Serangoon",
    "Simpang",
    "Singapore River",
    "Southern Islands",
    "Sungei Kadut",
    "Tampines",
    "Tanglin",
    "Tengah",
    "Toa Payoh",
    "Tuas",
    "Western Islands",
    "Western Water Catchment",
    "Woodlands",
    "Yishun"
  ]
  
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
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-1 mr-2"
        >
          <option value="">All Regions</option>
          {towns.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white border border-gray-300 rounded px-3 py-1 mr-2"
        >
          <option value="">All Categories</option>
          <option value="Medical">Medical</option>
          <option value="Household">Household</option>
          <option value="Misc">Misc</option>
          <option value="Edibles">Edibles</option>
        </select>
<label className="pl-5 pr-5 pt-2 font-medium">Price :</label>
        <Slider
  min={0}
  max={5000}
  value={selectedPriceRange[1]} 
  onChange={(value) =>
    setSelectedPriceRange([0, value]) // Update only the maximum value
  }
  className="my-4 mb-2"
  style={{ width: "300px" }} // Adjust the width as desired
/>
<div className="text-center mb-2 pl-5 pt-2 font-medium">
  ${selectedPriceRange[0]} - ${selectedPriceRange[1]}
</div>
        </div>

        <div className="flex flex-wrap gap-5 p-5 justify-center">
          {
            homeProduct[0] && homeProduct.filter((product) => product.status !== "Deleted").map(el => {
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