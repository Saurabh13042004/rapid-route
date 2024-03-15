// context/BookingContext.js

import React, { createContext, useState, useContext, useEffect } from "react";

const BookingContext = createContext();

export const useBookingContext = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    source: "",
    destination: "",
    startTime: "",
    date: "",
  });


  const apiURL = "https://rapid-route.onrender.com";

  const [previousBookings, setPreviousBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableCabs, setAvailableCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState(null);
  const [isFetchingCabs, setIsFetchingCabs] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [toast, setToast] = useState(null); // New toast state

  useEffect(() => {
    fetch(`${apiURL}/api/bookings/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        return response.json();
      })
      .then((data) => {
        setPreviousBookings(data.bookings);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const showToast = (message, status) => {
    setToast({ message, status });
    setTimeout(() => {
      hideToast();
    }, 3000); // Set timeout to hide toast after 3 seconds
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckAvailableCabs = async () => {
    if (
      !formData.source ||
      !formData.destination ||
      !formData.startTime ||
      !formData.date
    ) {
      setBookingError("Please fill in all the fields");
      setBookingStatus("error");
      setTimeout(() => {
        setBookingStatus(null);
        setBookingError(null);
      }, 2000);
      return;
    }

    setIsFetchingCabs(true);
    try {
      const response = await fetch(`${apiURL}/api/bookings/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch available cabs");
      }
      const data = await response.json();
      setAvailableCabs(data.availableCabsWithRates);
    } catch (error) {
      console.error(error);
      setBookingStatus("error");
    } finally {
      setIsFetchingCabs(false);
    }
  };

  const handleCabSelection = (cabId) => {
    setSelectedCab(cabId);
  };

  const handleCreateBooking = async () => {
    try {
      const response = await fetch(`${apiURL}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cabId: selectedCab,
        }),
      });
      const responseData = await response.json(); // Parse response JSON

      if (!response.ok) {
        throw new Error(responseData.message); // Throw error message received from server
      } else {
        setBookingStatus("success");
        setTimeout(() => setBookingStatus(null), 2000);
        resetFormFields();
      }
    } catch (error) {
      console.error(error);
      setBookingError(error.message); // Set booking error message
      setBookingStatus("error");
      setTimeout(() => {
        setBookingStatus(null);
        setBookingError(null); // Clear error message after displaying
      }, 2000);
    }
  };

  const resetFormFields = () => {
    setFormData({
      name: "",
      email: "",
      source: "",
      destination: "",
      startTime: "",
      date: "",
    });
  };


  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`${apiURL}/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      const data = await response.json();
      setPreviousBookings((previousBookings) =>
        previousBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <BookingContext.Provider
      value={{
        formData,
        setFormData,
        availableCabs,
        setAvailableCabs,
        selectedCab,
        setSelectedCab,
        isFetchingCabs,
        setIsFetchingCabs,
        bookingStatus,
        setBookingStatus,
        bookingError, // Provide booking error to components
        handleChange,
        handleCheckAvailableCabs,
        handleCabSelection,
        handleCreateBooking,
        previousBookings,
        handleDeleteBooking,
        showToast,
        hideToast,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
