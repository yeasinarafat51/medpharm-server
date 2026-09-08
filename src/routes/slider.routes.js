const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const database = client.db("medpharmDB");
const sliderCollection = database.collection("sliders");

const addSlider = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      buttonText,
      buttonLink,
      isActive,
      order,
    } = req.body || {};

    const slider = {
      title: typeof title === "string" ? title.trim() : "",
      description: typeof description === "string" ? description.trim() : "",
      image: typeof image === "string" ? image.trim() : "",
      buttonText: typeof buttonText === "string" ? buttonText.trim() : "",
      buttonLink: typeof buttonLink === "string" ? buttonLink.trim() : "",
      isActive: isActive !== false,
      order: Number(order) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await sliderCollection.insertOne(slider);

    res.status(201).send({
      success: true,
      message: "Slider added successfully",
      insertedId: result.insertedId,
      slider: {
        _id: result.insertedId,
        ...slider,
      },
    });
  } catch (error) {
    console.error("Add Slider Error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to add slider",
      error: error.message,
    });
  }
};

const getAllSliders = async (req, res) => {
  try {
    const sliders = await sliderCollection
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.status(200).send({
      success: true,
      sliders,
    });
  } catch (error) {
    console.error("Get All Sliders Error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch sliders",
      error: error.message,
    });
  }
};

const getActiveSliders = async (req, res) => {
  try {
    const sliders = await sliderCollection
      .find({
        isActive: true,
      })
      .sort({
        order: 1,
        createdAt: -1,
      })
      .toArray();

    res.status(200).send({
      success: true,
      sliders,
    });
  } catch (error) {
    console.error("Get Active Sliders Error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch active sliders",
      error: error.message,
    });
  }
};

const getSingleSlider = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid slider ID",
      });
    }

    const slider = await sliderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!slider) {
      return res.status(404).send({
        success: false,
        message: "Slider not found",
      });
    }

    res.status(200).send({
      success: true,
      slider,
    });
  } catch (error) {
    console.error("Get Single Slider Error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch slider",
      error: error.message,
    });
  }
};

const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid slider ID",
      });
    }

    const {
      title,
      description,
      image,
      buttonText,
      buttonLink,
      isActive,
      order,
    } = req.body || {};

    const updateData = {
      updatedAt: new Date(),
    };

    if (typeof title === "string") {
      updateData.title = title.trim();
    }

    if (typeof description === "string") {
      updateData.description = description.trim();
    }

    if (typeof image === "string") {
      updateData.image = image.trim();
    }

    if (typeof buttonText === "string") {
      updateData.buttonText = buttonText.trim();
    }

    if (typeof buttonLink === "string") {
      updateData.buttonLink = buttonLink.trim();
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (order !== undefined && order !== null && order !== "") {
      const numericOrder = Number(order);

      if (Number.isFinite(numericOrder)) {
        updateData.order = numericOrder;
      }
    }

    const result = await sliderCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: updateData,
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Slider not found",
      });
    }

    const updatedSlider = await sliderCollection.findOne({
      _id: new ObjectId(id),
    });

    res.status(200).send({
      success: true,
      message: "Slider updated successfully",
      slider: updatedSlider,
    });
  } catch (error) {
    console.error("Update Slider Error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to update slider",
      error: error.message,
    });
  }
};

const toggleSlider = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid slider ID",
      });
    }

    const slider = await sliderCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!slider) {
      return res.status(404).send({
        success: false,
        message: "Slider not found",
      });
    }

    const newStatus = slider.isActive !== true;

    const result = await sliderCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          isActive: newStatus,
          updatedAt: new Date(),
        },
      },
    );

    if (result.modifiedCount === 0) {
      return res.status(400).send({
        success: false,
        message: "Slider status update failed",
      });
    }

    const updatedSlider = await sliderCollection.findOne({
      _id: new ObjectId(id),
    });

    res.status(200).send({
      success: true,
      message: "Slider status updated successfully",
      slider: updatedSlider,
    });
  } catch (error) {
    console.error("Toggle Slider Error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to update slider status",
      error: error.message,
    });
  }
};

const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid slider ID",
      });
    }

    const result = await sliderCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Slider not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Slider deleted successfully",
    });
  } catch (error) {
    console.error("Delete Slider Error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to delete slider",
      error: error.message,
    });
  }
};

module.exports = {
  addSlider,
  getAllSliders,
  getActiveSliders,
  getSingleSlider,
  updateSlider,
  toggleSlider,
  deleteSlider,
};
