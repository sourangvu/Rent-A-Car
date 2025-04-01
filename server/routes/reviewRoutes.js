import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { addReview, deleteReview, getAverageRating, getCarReviews } from "../controllers/reviewController.js";

const router = express.Router();

//update review
//add review
router.post("/add-reivew",userAuth,addReview)


//delete review
router.delete("/delete-review",userAuth,deleteReview)

// get course reviews
router.get('/car-reviews',getCarReviews)


// course avg rating
router.get("/avg-rating",getAverageRating)


// get car reviews by specific user


export { router as reviewRoutes };