import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { Record, String, Number, Boolean } from "runtypes";

//import { authenticateUser } from "./auth.js";
import CyclicDb from "@cyclic.sh/dynamodb";

import { Router } from "express";

// Initialize Express router
export const router = Router();

// Initialize AWS DynamoDB
const db = CyclicDb(process.env.CYCLIC_DB)
const catCollection = db.collection("category");

// ------------------------------------
// GET ROUTES
// ------------------------------------

// Get all categories
router.get("/category/all", async (req, res) => {
  const { results: catMetadata } = await catCollection.list();

  const categories = await Promise.all(
    catMetadata.map(async ({ key }) => (await catCollection.get(key)).props)
  );

  res.send(categories);
});

// Get bike by ID
// router.get("/:id", async (req, res) => {
//   const id = req.params.id;

//   try {
//     const { props: bike } = await bikesCollection.get(id);
//     res.send(bike);
//   } catch (e) {
//     console.log(e.message, `Item with ID ${id} does not exist.`);
//     res.sendStatus(404);
//   }
// });

// // Get bike by handle
// router.get("/by-handle/:handle", async (req, res) => {
//   const handle = req.params.handle;

//   try {
//     const { results } = await bikesCollection.filter({ handle });
//     if (!results.length) throw new Error();

//     const { props: bike } = results[0];
//     res.send(bike);
//   } catch (e) {
//     console.log(e.message, `Item with handle ${handle} does not exist.`);
//     res.sendStatus(404);
//   }
// });

// Search bikes by title
// router.get("/search/by-title", async (req, res) => {
//   const query = req.query.query || "";

//   try {
//     const { results } = await bikesCollection.parallel_scan({
//       expression: "contains(#title, :title)",
//       attr_names: {
//         "#title": "title",
//       },
//       attr_vals: {
//         ":title": query,
//       },
//     });

//     const bikes = results.map(({ props }) => props);
//     res.send(bikes);
//   } catch (e) {
//     console.log(e.message);
//     res.sendStatus(400);
//   }
// });

// ------------------------------------
// POST ROUTES
// ------------------------------------

// Type for new bikes
const Money = Record({
  amount: Number,
  currencyCode: String,
});
const PriceRange = Record({
  minPrice: Money,
  maxPrice: Money,
});
const CategoryData = Record({
  description: String,
});

//Post new Category
router.post("/category", async (req, res) => {
    const catData = req.body;

    try {
      // Make sure bike data exists
      if (!req.body) {
        throw new Error();
      }
  
      // Make sure bike data contains all required fields
      const categoryObject = CategoryData.check(catData);
  
      // Generate ID and Handle for bike
      const categoryId = uuidv4();
  
      // Create full bike object
      const category = {
        ...categoryObject,
        id: categoryId
      };
  
      // Save bike object
      await catCollection.set(categoryId, category);
  
      res.send(category);
    } catch (e) {
      res.sendStatus(400);
    }
});

// // ------------------------------------
// // PATCH ROUTES
// // ------------------------------------

// // Patch bike if it exists
// router.patch("/:id", authenticateUser, async (req, res) => {
//   const bikeId = req.params.id;
//   const newData = req.body || {};

//   try {
//     const { props: oldBike } = await bikesCollection.get(bikeId);
//     const bike = {
//       ...oldBike,
//       ...newData,
//     };

//     // Save new bike object
//     await bikesCollection.set(bikeId, newData);

//     res.send(bike);
//   } catch (e) {
//     console.log(e.message);
//     res.sendStatus(404);
//   }
// });

// // ------------------------------------
// // PUT ROUTES
// // ------------------------------------

// // Update entire bike
// router.put("/:id", authenticateUser, async (req, res) => {
//   const bikeId = req.params.id;
//   const bikeData = req.body;

//   try {
//     // Make sure bike data exists
//     if (!req.body) {
//       throw new Error();
//     }

//     // Make sure bike has ID and handle
//     if (!bikeData.id || !bikeData.handle) {
//       throw new Error();
//     }

//     // Make sure bike data contains all required fields
//     const bikeObject = BikeData.check(bikeData);

//     // Delete existing bike object
//     await bikesCollection.delete(bikeId);

//     // Save new bike object
//     await bikesCollection.set(bikeId, bikeObject);

//     res.send(bikeObject);
//   } catch (e) {
//     console.log(e.message);
//     res.sendStatus(404);
//   }
// });

// // ------------------------------------
// // DELETE ROUTES
// // ------------------------------------

// // Delete bike if it exists
// router.delete("/:id", authenticateUser, async (req, res) => {
//   const bikeId = req.params.id;

//   try {
//     await bikesCollection.delete(bikeId);

//     res.send({
//       id: bikeId,
//     });
//   } catch (e) {
//     console.log(e.message);
//     res.sendStatus(404);
//   }
// });
