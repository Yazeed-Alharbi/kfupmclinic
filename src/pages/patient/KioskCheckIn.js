import { useState } from "react";
import config from "../../commonComponents/config";
import kfupmlogo from "../../assets/kfupmlogo.png";

const KioskCheckIn = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [inputVisible, setInputVisible] = useState(true); // State to toggle input visibility

  const handleSend = () => {
    if (!appointmentId.trim()) {
      setFeedbackWithTimeout({ type: "error", message: "Please enter a valid appointment ID." });
      return;
    }

    const socket = new WebSocket(`ws://${config.KIOSK_HOST}:${config.KIOSK_PORT}`);

    socket.onopen = () => {
      setFeedback({ type: "info", message: "Processing request..." }); // Show processing feedback
      const data = { appointmentId };
      socket.send(JSON.stringify(data));
    };

    socket.onmessage = (event) => {
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

    socket.onerror = () => {
      setFeedbackWithTimeout({ type: "error", message: "Connection lost. Please try again." });
    };

    // Hide the input after sending the appointment ID
    setInputVisible(false);
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
          {inputVisible ? (
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
