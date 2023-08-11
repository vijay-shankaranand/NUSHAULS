import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BsCloudUpload } from 'react-icons/bs';
import { ImagetoBase64 } from '../utility/ImagetoBase64';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NewProduct = () => {
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [data, setData] = useState({
    name: '',
    category: '',
    image: '',
    price: '',
    description: '',
    user: '',
    region: '',
    status: 'Available',
    number: '',
    address: '',
  });

  data.user = userData._id;
  data.region = userData.region;
  data.number = userData.number;
  data.address = userData.address;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCurrency = (e) => {
    const { name, value } = e.target;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === '') {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImage = async (e) => {
    if (e.target.files[0]) {
      const data = await ImagetoBase64(e.target.files[0]);
      setData((prev) => ({ ...prev, image: data }));
    }
  };

  const handleVerification = () => {
    const { name, image, category, price } = data;

    if (name && image && category && price) {
      if (
        userData.region === undefined ||
        userData.address === undefined ||
        userData.number === undefined
      ) {
        toast('Please fill up all additional details under My Profile section before uploading!');
      } else {
        setShowModal(true);
      }
    } else {
      toast('Enter Required Fields!');
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/uploadProduct`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const fetchRes = await fetchData.json();

    toast.success(fetchRes.message);

    setData({
      name: '',
      category: '',
      image: '',
      price: '',
      description: '',
      user: '',
      region: '',
      status: '',
      address: '',
      number: '',
    });
    navigate('/seller-home');
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
    <div className="m-auto w-full text-center p-10 bg-amber-200">
          <h2 className="text-4xl font-bold">Add New <span className="text-amber-500">Product</span></h2>
          </div>
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-md w-full">
        
        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full mb-3"
              onChange={handleOnChange}
              value={data.name}
              maxLength="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
              Category
            </label>
            <select
              className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full mb-3"
              id="category"
              name="category"
              onChange={handleOnChange}
              value={data.category}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Edibles">Food & Snacks</option>
              <option value="Household">Household</option>
              <option value="Medical">Medical</option>
              <option value="Misc">Misc</option>
            </select>
          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="image">
    Image
  </label>
  <label
    htmlFor="image"
    className="h-60 bg-gray-100 border border-gray-300 rounded flex items-center justify-center cursor-pointer mb-3"
  >
    {data.image ? (
      <img src={data.image} alt="" className="h-full" />
    ) : (
      <span className="text-5xl text-gray-400">
        <BsCloudUpload />
      </span>
    )}
    <input
      type="file"
      accept="image/*"
      id="image"
      onChange={uploadImage}
      className="hidden"
    />
  </label>
</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="price">
              Price
            </label>
            <input
              type="text"
              className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full mb-3"
              name="price"
              onChange={handleCurrency}
              value={data.price}
              placeholder="$"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              rows={2}
              value={data.description}
              className="bg-gray-100 border border-gray-300 rounded px-3 py-2 w-full mb-3 resize-none"
              name="description"
              onChange={handleOnChange}
            ></textarea>
          </div>
          <button
            onClick={handleVerification}
            className="bg-amber-500 hover:bg-blue-800 text-white text-lg font-medium py-2 px-4 rounded"
          >
            Upload
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-bold mb-4">Confirmation</h2>
            <p className="font-medium">
              <span className="font-bold">Contact Number:</span> {userData.number}
            </p>
            <p className="pt-3 font-medium">
              <span className="font-bold">Full Address:</span> {userData.address}
            </p>
            <p className="pt-3 font-medium">
              <span className="font-bold">Region:</span> {userData.region}
            </p>
            <p className="pt-5">
              <span className="text-red-500">*</span>Please correct your details in{' '}
              <span className="font-medium">My Profile</span> section if they are incorrect
            </p>
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
      )}
    </div>
    </div>
  );
};

export default NewProduct;
