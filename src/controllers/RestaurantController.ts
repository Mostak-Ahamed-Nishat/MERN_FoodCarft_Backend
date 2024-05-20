import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    //Get the city name
    const city = req.params.city;

    //Search query
    const searchQuery = (req.query.searchQuery as string) || "";
    //Get the select cuisine item
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    //Sort option
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    //get the page number
    const page = parseInt(req.query.page as string) || 1;

    //Create query
    let query: any = {};

    // check if there any restaurant in the given city by customer
    query["city"] = new RegExp(city, "i");

    //Check how many restaurant in your area

    const cityCheck = await Restaurant.countDocuments(query);
    //If no restaurant available in your city return empty array
    if (cityCheck == 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    //If user selected any cuisines
    if (selectedCuisines) {
      //get all the selected cuisines split it and turn into array and map throw every cuisine and avoid case sensitive and store the array into cuisinesArray
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      //Get only that restaurant who have all the items that selected on the cuisinesArray
      query["selectedCuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }
    //create query

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    //sortOption="lastUpdated"
    const restaurant = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    //count how may restaurant found based on search
    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurant,
      pagination: {
        total: total,
        page,
        pages: Math.ceil(total / pageSize), // 50 data / every page 10 max : pages need:5
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export default {
  searchRestaurant,
};
