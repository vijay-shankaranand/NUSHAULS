import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast'
import {BsCloudUpload} from "react-icons/bs"
import { ImagetoBase64 } from '../utility/ImagetoBase64'

const ProductSeller = () => {
  const navigate = useNavigate();

  const productData = useSelector((state) => state.product.productList);
  const orderData = useSelector((state) => state.order.orderList);
  const { filterby } = useParams();


  const [updateStatus, setUpdateStatus] = useState("idle");
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState({
    name: "",
    image:"",
    category: "",
    price: "",
    description: "",
    status:""
  });


  const handleCurrency = (e) => {
    const {name,value} = e.target
    // Regex to match only numeric values with up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === '') {
      setEditedProduct((preve)=>{
        return{
          ...preve,
          [name] : value
        }
    })
    }
  };

  const openEditPopup = () => {
    setIsEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    const data = {
      productId: filterby,
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/deleteProduct/${filterby}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
        toast.success("Product deleted successfully");
        navigate("/seller-home");
      
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  
  const handleProductUpdate = async () => {
    setUpdateStatus("loading");
  
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/editProduct/${filterby}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update product.");
      }
  
      setUpdateStatus("success");
      toast.success("Product updated successfully");
      navigate("/seller-home");
    } catch (error) {
      console.error("Error updating product:", error);
      setUpdateStatus("error");
    }
  };

  const hasOngoingOrders = orderData.some(
    (order) =>
      order.product === filterby &&
      order.state !== "Expired" &&
      order.state !== "Delivered"
  );

  const handleEdit = () => {
    if (hasOngoingOrders) {
      toast.error(
        "This product has ongoing orders. They need to be fulfilled before you can edit the listing."
      );
    } else {
      openEditPopup();
    }
  };


  const uploadImage = async(e)=>{
    if (e.target.files[0]) {
      const data = await ImagetoBase64(e.target.files[0])
      
    

      setEditedProduct((preve)=>{
        return{
          ...preve,
          image : data
        }
      })
    }
  }
  
  return (
    <div className="">
      <div className="m-auto w-full text-center p-10 bg-amber-200">
        <h2 className="text-4xl font-bold">
          Product <span className="text-amber-500">Info</span>
        </h2>
      </div>

      <div className="p-2 md:p-4">
        <div className="w-full max-w-4xl m-auto p-5">
          <div className="w-[400px] h-[500px] w-full pb-5">
            <img
              src={
                productData[0] &&
                productData.filter((el) => el._id === filterby)[0].image
              }
              className="hover:scale-105 transition-all h-full"
              alt="loading"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-slate-600  capitalize text-2xl md:text-4xl">
              {productData[0] &&
                productData.filter((el) => el._id === filterby)[0].name}
            </h3>
            <p className=" text-slate-500  font-medium text-2xl">
              {productData[0] &&
                productData.filter((el) => el._id === filterby)[0].category}
            </p>
            <p className=" font-bold md:text-2xl">
              <span className="text-amber-500 ">$</span>
              <span>
                {productData[0] &&
                  productData.filter((el) => el._id === filterby)[0].price}
              </span>
            </p>
            <div>
              <p className="text-slate-600 font-medium">Description : </p>
              <p>
                {productData[0] &&
                  productData.filter((el) => el._id === filterby)[0]
                    .description}
              </p>
            </div>
            <div>
              <p className="text-slate-600 font-medium">Product ID : </p>
              <p>
                {productData[0] &&
                  productData.filter((el) => el._id === filterby)[0]
                    ._id}
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2 pt-8">
            <button
              className="bg-rose-600 hover:bg-rose-800 text-white font-bold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
  className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
  onClick={handleEdit}
>
  Edit
</button>
          </div>
        </div>
      </div>
      {isEditPopupOpen && (
  <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-500 bg-opacity-50">
    <div className="bg-white p-4">
      <h2 className="text-2xl mb-4 font-bold">Edit Product</h2>
      <form>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={editedProduct.name}
              onChange={handleInputChange}
              className="border border-gray-400 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="col-span-2">
            <label htmlFor='image' className="block text-gray-700 font-bold mb-2">
              Image
              <div className='h-60 w-full rounded flex items-center justify-center cursor-pointer border border-gray-400 rounded'>
                {editedProduct.image ? (
                  <img src={editedProduct.image} className="h-full" alt=""/>
                ) : (
                  <span className='text-5xl'><BsCloudUpload/></span>
                )}
                <input type={"file"} accept="image/*" id="image" onChange={uploadImage} className="hidden"/>
              </div>
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
              Category
            </label>

            <select className='border border-gray-400 rounded px-3 py-2 w-full' id='category' name='category' onChange={handleInputChange} value={editedProduct.category}>
          <option value='' selected disabled>Select Category</option>
          <option value={"Edibles"}>Food & Snacks</option>
          <option value={"Household"}>Household</option>
          <option value={"Medical"}>Medical</option>
          <option value={"Misc"}>Misc</option>
        </select>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
              Price
            </label>
            <input
              type="text"
              name="price"
              id="price"
              value={editedProduct.price}
              onChange={handleCurrency}
              className="border border-gray-400 rounded px-3 py-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={editedProduct.description}
              onChange={handleInputChange}
              className="border border-gray-400 rounded px-3 py-2 w-full"
            ></textarea>
          </div>
          
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={handleProductUpdate}
            disabled={updateStatus === "loading"}
          >
            {updateStatus === "loading" ? "Updating..." : "Save"}
          </button>
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={closeEditPopup}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default ProductSeller;