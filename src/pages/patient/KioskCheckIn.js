import { useState, useEffect } from "react";
import config from "../../commonComponents/config";
import kfupmlogo from "../../assets/kfupmlogo.png";

const KioskCheckIn = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [inputVisible, setInputVisible] = useState(true); // State to toggle input visibility
  const [isConnected, setIsConnected] = useState(true); // Tracks WebSocket connection status
  const [socket, setSocket] = useState(null); // Track the WebSocket instance

  useEffect(() => {
    const connectWebSocket = () => {
      const newSocket = new WebSocket(`ws://${config.KIOSK_HOST}:${config.KIOSK_PORT}`);

      newSocket.onopen = () => {
        console.log("WebSocket connection opened.");
        setIsConnected(true); // Update connection status
      };

      newSocket.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);

          if (response.status === "success") {
            setFeedbackWithTimeout({ type: "success", message: `Check-in successful: ${response.message}` });
          } else if (response.status === "error") {
            setFeedbackWithTimeout({ type: "error", message: response.message || "An error occurred." });
          } else {
            setFeedbackWithTimeout({ type: "info", message: response.message || "Unexpected server response." });
          }
        } catch (error) {
          setFeedbackWithTimeout({ type: "error", message: "Invalid response from server." });
        }
      };

      newSocket.onerror = () => {
        console.error("WebSocket error occurred.");
        setIsConnected(false); // Mark as disconnected
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed.");
        setIsConnected(false); // Mark as disconnected

        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      setSocket(newSocket); // Save the WebSocket instance to state
    };

    connectWebSocket(); // Establish WebSocket connection on mount

    return () => {
      if (socket) {
        socket.close(); // Clean up WebSocket on unmount
      }
    };
  }, []); // Run only once on component mount

  const handleSend = () => {
    if (!appointmentId.trim()) {
      setFeedbackWithTimeout({ type: "error", message: "Please enter a valid appointment ID." });
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      setFeedback({ type: "info", message: "Processing request..." });
      const data = { appointmentId };
      socket.send(JSON.stringify(data));
    } else {
      setFeedbackWithTimeout({ type: "error", message: "Connection is not established. Please try again." });
    }

    setInputVisible(false); // Hide the input area after sending
  };

  const setFeedbackWithTimeout = (feedback) => {
    setFeedback(feedback);

    // Set a timeout to clear the feedback after 5 seconds and show the input again
    setTimeout(() => {
      setFeedback(null);
      setInputVisible(true); // Show the input field again
      setAppointmentId(""); // Clear the input value
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="p-4 h-24 sm:h-16 flex items-center justify-center relative border-b bg-white">
        <div className="absolute left-4 flex items-center space-x-3">
          <img src={kfupmlogo} className="w-10" alt="KFUPM Logo" />
          <div className="font-semibold text-xl text-kfupmgreen">
            KFUPM <span className="text-textgray">Clinic</span>
          </div>
        </div>
        <div className="font-semibold text-2xl text-textgray">Check In</div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow items-center justify-center">
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
          {!isConnected ? (
            // Show error if WebSocket is not connected
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-6">Service Unavailable</h2>
              <p className="text-lg text-gray-700">
                The system is currently out of service. Please wait or contact the clinic staff for assistance.
              </p>
            </div>
          ) : inputVisible ? (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Enter Appointment ID</h2>
              <input
                type="text"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                placeholder="Enter Appointment ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
              <button
                onClick={handleSend}
                className="w-full bg-kfupmgreen text-white px-4 py-3 text-lg rounded-md hover:bg-green-800 transition"
              >
                Check in
              </button>
            </>
          ) : (
            feedback && (
              <div
                className={`p-4 text-lg rounded-md ${
                  feedback.type === "success"
                    ? "bg-green-200 text-green-800"
                    : feedback.type === "error"
                    ? "bg-red-200 text-red-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {feedback.message}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default KioskCheckIn;
