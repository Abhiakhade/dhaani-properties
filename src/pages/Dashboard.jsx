import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "../Components/PropertyCard";
import { LikedContext } from "../context/LikedContext";
import Avatar from "react-avatar";
import { BASE_URL } from "../config"; // use curly braces


const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const { likedProperties, setLikedProperties } = useContext(LikedContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUserData(data.user);
        setLikedProperties(data.user.likedProperties || []);
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate, setLikedProperties]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userData)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-base sm:text-lg animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-3 m-10 sm:px-6 md:px-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
          👋 Welcome, <span className="text-indigo-600">{userData.name}</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base shadow-md transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          {/* <img
  src={`https://dummyimage.com/120x120/ccc/000&text=${userData.name?.charAt(0) || "U"}`}
  alt="Profile"
/> */}
          <Avatar name={userData.name} size="120" round={true} />

          <div className="flex flex-col gap-1.5 text-gray-700 w-full">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
              {userData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base">
              <p>
                <span className="font-medium text-gray-800">Email:</span>{" "}
                {userData.email}
              </p>
              <p>
                <span className="font-medium text-gray-800">Phone:</span>{" "}
                {userData.phone || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-800">City:</span>{" "}
                {userData.city || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-800">Joined:</span>{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-700 leading-relaxed">
              Keep discovering properties — your liked ones will always be saved
              here ❤️
            </div>
          </div>
        </div>
      </div>

      {/* Liked Properties */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-5 text-gray-800 border-b border-indigo-100 pb-2">
          ❤️ Your Liked Properties
        </h2>

        {likedProperties.length === 0 ? (
          <div className="bg-white p-8 sm:p-10 rounded-xl shadow-sm text-center text-gray-600">
            <p className="text-base sm:text-lg mb-3">No liked properties yet.</p>
            <button
              onClick={() => navigate("/all-properties")}
              className="bg-black hover:bg-gray-950 text-white px-5 py-2 rounded-md text-sm sm:text-base transition"
            >
              Explore Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {likedProperties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                userLikedProperties={likedProperties}
                setUserLikedProperties={setLikedProperties}
                // hideLikeButton={true}
                smallCard={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
