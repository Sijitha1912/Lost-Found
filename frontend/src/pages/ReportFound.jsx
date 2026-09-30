import { useState } from "react";

function ReportFound() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please sign in before reporting a found item.");
      return;
    }

    const formData = new FormData(form);

    const foundItem = {
      itemName: formData.get("itemName"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      color: formData.get("color"),
      foundDate: formData.get("foundDate"),
      foundLocation: formData.get("foundLocation"),
      identifyingMarks: formData.get("identifyingMarks"),
      description: formData.get("description"),
      reportedBy: user.id
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/found-items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(foundItem)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        console.log("Found item saved:", data);
        form.reset();
      } else {
        alert(data.message || "Failed to submit found report");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1 className="page-title">Report a Found Item</h1>

        <p className="page-subtitle">
          Provide the details below to help the owner find their item.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              name="itemName"
              type="text"
              placeholder="e.g. College ID Card"
              required
            />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input
              name="brand"
              type="text"
              placeholder="e.g. Samsung, HP, Nike"
            />
          </div>

          <div className="form-group">
            <label>Model / Type</label>
            <input
              name="model"
              type="text"
              placeholder="e.g. Galaxy A55, Backpack"
            />
          </div>

          <div className="form-group">
            <label>Color</label>
            <input
              name="color"
              type="text"
              placeholder="e.g. Black, Blue"
              required
            />
          </div>

          <div className="form-group">
            <label>Found Date</label>
            <input
              name="foundDate"
              type="date"
              required
            />
          </div>

          <div className="form-group">
            <label>Found Location</label>
            <input
              name="foundLocation"
              type="text"
              placeholder="e.g. Library, Block A, Canteen"
              required
            />
          </div>

          <div className="form-group">
            <label>Item Photo</label>
            <input
              name="photo"
              type="file"
              accept="image/*"
            />
          </div>

          <div className="form-group">
            <label>Identifying Marks</label>
            <input
              name="identifyingMarks"
              type="text"
              placeholder="e.g. Sticker, scratch, name label"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Add any other details about the found item..."
            ></textarea>
          </div>

          <button className="primary-btn" type="submit">
            Submit Found Report
          </button>

          {submitted && (
            <p className="success-message">
              Found report submitted successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ReportFound;