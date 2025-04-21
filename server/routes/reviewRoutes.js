import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { addReview, deleteReview, getAverageRating, getCarReviews, getUserReviews } from "../controllers/reviewController.js";

const router = express.Router();

//update review
//add review
router.post("/add-review",userAuth,addReview)


//delete review
router.delete("/delete-review/:reviewId", userAuth, deleteReview);

// get course reviews
router.get('/car-reviews/:carId', getCarReviews);

router.get('/my-reviews', userAuth, getUserReviews);


// course avg rating
router.get("/avg-rating",getAverageRating)


// get car reviews by specific user


export { router as reviewRoutes };