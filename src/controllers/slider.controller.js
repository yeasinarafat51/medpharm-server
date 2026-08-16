const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const database = client.db("medpharmDB");

const sliderCollection = database.collection("sliders");

// =====================================================
// ADD SLIDER
// =====================================================

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
    } = req.body;

    // Validation
    if (!title || !image) {
      return res.status(400).send({
        success: false,
        message: "Title and image are required",
      });
    }

    const slider = {
      title: title.trim(),
      description: description?.trim() || "",
      image: image.trim(),
      buttonText: buttonText?.trim() || "Shop Now",
      buttonLink: buttonLink?.trim() || "/all-medicines",

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
    });
  } catch (error) {
    console.error("Add Slider Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL SLIDERS
// =====================================================

const getSliders = async (req, res) => {
  try {
    const sliders = await sliderCollection
      .find({})
      .sort({
        order: 1,
        createdAt: -1,
      })
      .toArray();

    res.send({
      success: true,
      sliders,
    });
  } catch (error) {
    console.error("Get Sliders Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET ACTIVE SLIDERS
// =====================================================

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

    res.send({
      success: true,
      sliders,
    });
  } catch (error) {
    console.error("Get Active Sliders Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET SINGLE SLIDER
// =====================================================

const getSingleSlider = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
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

    res.send({
      success: true,
      slider,
    });
  } catch (error) {
    console.error("Get Single Slider Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE SLIDER
// =====================================================

const updateSlider = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
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
    } = req.body;

    const updateData = {
      title: title?.trim() || "",
      description: description?.trim() || "",
      image: image?.trim() || "",
      buttonText: buttonText?.trim() || "Shop Now",
      buttonLink: buttonLink?.trim() || "/all-medicines",
      isActive: Boolean(isActive),
      order: Number(order) || 0,
      updatedAt: new Date(),
    };

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

    res.send({
      success: true,
      message: "Slider updated successfully",
    });
  } catch (error) {
    console.error("Update Slider Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// TOGGLE ACTIVE / INACTIVE
// =====================================================

const toggleSlider = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
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

    const result = await sliderCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          isActive: !slider.isActive,
          updatedAt: new Date(),
        },
      },
    );

    res.send({
      success: true,
      message: `Slider ${
        !slider.isActive ? "activated" : "deactivated"
      } successfully`,
      isActive: !slider.isActive,
      result,
    });
  } catch (error) {
    console.error("Toggle Slider Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE SLIDER
// =====================================================

const deleteSlider = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
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

    res.send({
      success: true,
      message: "Slider deleted successfully",
    });
  } catch (error) {
    console.error("Delete Slider Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addSlider,
  getSliders,
  getActiveSliders,
  getSingleSlider,
  updateSlider,
  toggleSlider,
  deleteSlider,
};
