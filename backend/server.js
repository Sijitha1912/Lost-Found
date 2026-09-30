const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const User = require("./models/User");
const LostItem = require("./models/LostItem");
const FoundItem = require("./models/FoundItem");
const Match = require("./models/Match");
const Message = require("./models/Message");

const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI =
  "mongodb://lostfound_user:LostFound2026@ac-rp2bl9a-shard-00-00.6zanqxe.mongodb.net:27017,ac-rp2bl9a-shard-00-01.6zanqxe.mongodb.net:27017,ac-rp2bl9a-shard-00-02.6zanqxe.mongodb.net:27017/?ssl=true&replicaSet=atlas-sujegh-shard-0&authSource=admin&appName=LostFoundCluster";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("Lost & Found Backend is running!");
});

// ----------------------------------------------------
// MATCHING FUNCTION
// ----------------------------------------------------

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function fieldMatches(value1, value2) {
  const first = normalize(value1);
  const second = normalize(value2);

  if (!first || !second) {
    return false;
  }

  return (
    first === second ||
    first.includes(second) ||
    second.includes(first)
  );
}

function calculateMatchScore(lostItem, foundItem) {
  let score = 0;
  let availablePoints = 0;

  const fields = [
    {
      lost: lostItem.itemName,
      found: foundItem.itemName,
      points: 30
    },
    {
      lost: lostItem.brand,
      found: foundItem.brand,
      points: 20
    },
    {
      lost: lostItem.model,
      found: foundItem.model,
      points: 15
    },
    {
      lost: lostItem.color,
      found: foundItem.color,
      points: 15
    },
    {
      lost: lostItem.lostLocation,
      found: foundItem.foundLocation,
      points: 10
    },
    {
      lost: lostItem.identifyingMarks,
      found: foundItem.identifyingMarks,
      points: 10
    }
  ];

  fields.forEach((field) => {
    if (normalize(field.lost) && normalize(field.found)) {
      availablePoints += field.points;

      if (fieldMatches(field.lost, field.found)) {
        score += field.points;
      }
    }
  });

  if (availablePoints === 0) {
    return 0;
  }

  return Math.round((score / availablePoints) * 100);
}

// ----------------------------------------------------
// AUTOMATIC MATCHING
// ----------------------------------------------------

async function findMatchForLostItem(lostItem) {
  try {
    const foundItems = await FoundItem.find({
      status: "available"
    });

    for (const foundItem of foundItems) {
      const matchScore = calculateMatchScore(
        lostItem,
        foundItem
      );

      if (matchScore >= 60) {
        const existingMatch = await Match.findOne({
          lostItem: lostItem._id,
          foundItem: foundItem._id
        });

        if (!existingMatch) {
          const match = new Match({
            lostItem: lostItem._id,
            foundItem: foundItem._id,
            matchScore,
            status: "possible"
          });

          await match.save();

          await LostItem.findByIdAndUpdate(
            lostItem._id,
            {
              status: "matched"
            }
          );

          await FoundItem.findByIdAndUpdate(
            foundItem._id,
            {
              status: "matched"
            }
          );

          console.log(
            `Automatic match found: ${matchScore}%`
          );

          return match;
        }
      }
    }

    return null;
  } catch (error) {
    console.log(
      "Automatic lost-item matching error:",
      error.message
    );

    return null;
  }
}

async function findMatchForFoundItem(foundItem) {
  try {
    const lostItems = await LostItem.find({
      status: "searching"
    });

    for (const lostItem of lostItems) {
      const matchScore = calculateMatchScore(
        lostItem,
        foundItem
      );

      if (matchScore >= 60) {
        const existingMatch = await Match.findOne({
          lostItem: lostItem._id,
          foundItem: foundItem._id
        });

        if (!existingMatch) {
          const match = new Match({
            lostItem: lostItem._id,
            foundItem: foundItem._id,
            matchScore,
            status: "possible"
          });

          await match.save();

          await LostItem.findByIdAndUpdate(
            lostItem._id,
            {
              status: "matched"
            }
          );

          await FoundItem.findByIdAndUpdate(
            foundItem._id,
            {
              status: "matched"
            }
          );

          console.log(
            `Automatic match found: ${matchScore}%`
          );

          return match;
        }
      }
    }

    return null;
  } catch (error) {
    console.log(
      "Automatic found-item matching error:",
      error.message
    );

    return null;
  }
}

// ----------------------------------------------------
// TEST USER
// ----------------------------------------------------

app.get("/test-user", async (req, res) => {
  try {
    const user = new User({
      name: "Test Student",
      email: "teststudent@example.com",
      password: "test123",
      role: "student"
    });

    const savedUser = await user.save();

    res.json(savedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error creating test user",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// CREATE USER
// ----------------------------------------------------

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email.toLowerCase().endsWith("@kiot.ac.in")) {
      return res.status(400).json({
        message: "Only KIOT college email addresses are allowed."
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists."
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "student"
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// LOGIN
// ----------------------------------------------------

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        message: "Student not found. Please sign up first."
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// CREATE LOST ITEM
// ----------------------------------------------------

app.post("/api/lost-items", async (req, res) => {
  try {
    const lostItem = new LostItem(req.body);

    const savedLostItem = await lostItem.save();

    await findMatchForLostItem(savedLostItem);

    const updatedLostItem = await LostItem.findById(
      savedLostItem._id
    );

    res.status(201).json(updatedLostItem);
  } catch (error) {
    res.status(500).json({
      message: "Error creating lost item",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// GET LOST ITEMS
// ----------------------------------------------------

app.get("/api/lost-items", async (req, res) => {
  try {
    const lostItems = await LostItem.find()
      .populate("reportedBy", "name email role");

    res.json(lostItems);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching lost items",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// CREATE FOUND ITEM
// ----------------------------------------------------

app.post("/api/found-items", async (req, res) => {
  try {
    const foundItem = new FoundItem(req.body);

    const savedFoundItem = await foundItem.save();

    await findMatchForFoundItem(savedFoundItem);

    const updatedFoundItem = await FoundItem.findById(
      savedFoundItem._id
    );

    res.status(201).json(updatedFoundItem);
  } catch (error) {
    res.status(500).json({
      message: "Error creating found item",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// GET FOUND ITEMS
// ----------------------------------------------------

app.get("/api/found-items", async (req, res) => {
  try {
    const foundItems = await FoundItem.find()
      .populate("reportedBy", "name email role");

    res.json(foundItems);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching found items",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// MANUAL MATCH
// ----------------------------------------------------

app.post("/api/matches", async (req, res) => {
  try {
    const { lostItem, foundItem, matchScore } = req.body;

    const existingMatch = await Match.findOne({
      lostItem,
      foundItem
    });

    if (existingMatch) {
      return res.json(existingMatch);
    }

    const match = new Match({
      lostItem,
      foundItem,
      matchScore,
      status: "possible"
    });

    const savedMatch = await match.save();

    await LostItem.findByIdAndUpdate(
      lostItem,
      {
        status: "matched"
      }
    );

    await FoundItem.findByIdAndUpdate(
      foundItem,
      {
        status: "matched"
      }
    );

    res.status(201).json(savedMatch);
  } catch (error) {
    res.status(500).json({
      message: "Error creating match",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// GET MATCHES
// ----------------------------------------------------

app.get("/api/matches", async (req, res) => {
  try {
    const matches = await Match.find({
      status: {
        $ne: "rejected"
      }
    })
      .populate("lostItem")
      .populate("foundItem");

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching matches",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// VERIFY MATCH / CLAIM OWNERSHIP
// ----------------------------------------------------

app.put("/api/matches/:id/verify", async (req, res) => {
  try {
    const { verifiedBy } = req.body;

    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      {
        status: "verified",
        verifiedBy: verifiedBy
      },
      {
        new: true
      }
    );

    if (!updatedMatch) {
      return res.status(404).json({
        message: "Match not found"
      });
    }

    await LostItem.findByIdAndUpdate(
      updatedMatch.lostItem,
      {
        status: "returned"
      }
    );

    await FoundItem.findByIdAndUpdate(
      updatedMatch.foundItem,
      {
        status: "returned"
      }
    );

    res.json({
      message: "Ownership verified and item marked as returned.",
      match: updatedMatch
    });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying match",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// REJECT MATCH
// ----------------------------------------------------

app.put("/api/matches/:id/reject", async (req, res) => {
  try {
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected"
      },
      {
        new: true
      }
    );

    if (!updatedMatch) {
      return res.status(404).json({
        message: "Match not found"
      });
    }

    await LostItem.findByIdAndUpdate(
      updatedMatch.lostItem,
      {
        status: "searching"
      }
    );

    await FoundItem.findByIdAndUpdate(
      updatedMatch.foundItem,
      {
        status: "available"
      }
    );

    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting match",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// SEND MESSAGE
// ----------------------------------------------------

app.post("/api/messages", async (req, res) => {
  try {
    const message = new Message(req.body);

    const savedMessage = await message.save();

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({
      message: "Error sending message",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// GET MESSAGES
// ----------------------------------------------------

app.get("/api/messages/:matchId", async (req, res) => {
  try {
    const messages = await Message.find({
      match: req.params.matchId
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({
        sentAt: 1
      });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching messages",
      error: error.message
    });
  }
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});