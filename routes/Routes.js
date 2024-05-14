import express, { response } from "express";
import listEndpoints from "express-list-endpoints";
import HappyThought from "../model/Happythoughts";
const router = express.Router();

//post new happy thought
router.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newHappyThought = await new HappyThought({ message }).save();
    res.status(201).json({
      success: true,
      response: newHappyThought,
      message: "Thought saved successfully",
    });
  } catch (error) {
    console.error(error); // Log the error
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not save thought",
    });
  }
});

//get all happy thoughts, but only the 20 most recent
router.get("/thoughts", async (req, res) => {
  const thoughts = await HappyThought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json({
    success: true,
    response: thoughts,
    message: "All thoughts fetched successfully",
  });
});

//post a like to a happy thought
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updatedThought = await HappyThought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (updatedThought) {
      res.json({
        success: true,
        response: updatedThought,
        message: "Like saved successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "Thought not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not save like",
    });
  }
});

//delete a happy thought
router.delete("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const deletedThought = await HappyThought.findByIdAndDelete(thoughtId);
    if (deletedThought) {
      res.json({
        success: true,
        response: deletedThought,
        message: "Thought deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "Thought not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not delete thought",
    });
  }
});

//filter happy thoughts by limit or skip or both
router.get("/thoughts/filter", async (req, res) => {
  const { limit, skip } = req.query;
  const thoughts = await HappyThought.find()
    .sort({ createdAt: "desc" })
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .exec();
  res.json({
    success: true,
    response: thoughts,
    message: "Filtered thoughts fetched successfully",
  });
});

// get updated documentation
router.get("/", (req, res) => {
  try {
    const endpoints = listEndpoints(router);
    const updatedEndpoints = endpoints.map((endpoint) => {
      if (endpoint.path === "/thoughts/filter") {
        return {
          path: endpoint.path,
          methods: endpoint.methods,
          queryParameters: [
            {
              name: "limit",
              description:
                "filter the thoughts by the number of thoughts you want to get Example: /thoughts/filter?limit=5  you could also combine limit and skip Example: /thoughts/filter?limit=5&skip=5",
            },
            {
              name: "skip",
              description:
                "filter the thoughts by the number of thoughts you want to skip Example: /thoughts/filter?skip=5  you could also combine limit and skip Example: /thoughts/filter?limit=5&skip=5",
            },
          ],
        };
      }
      return {
        path: endpoint.path,
        methods: endpoint.methods,
      };
    });
    res.json({
      success: true,
      response: updatedEndpoints,
      message: "Endpoints fetched successfully",
    });
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const customError = new Error(
      "An error occurred while fetching the endpoints"
    );
    res.status(404).json({
      success: false,
      response: error,
      message: customError.message,
    });
  }
});

router.use("/", (req, res) => {
  res.send(listEndpoints(router));
});

export default router;
