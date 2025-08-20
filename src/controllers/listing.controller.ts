import { Request, Response } from "express";
import * as listingService from "../services/listing.service";


/**
 * @swagger
 * components:
 *   schemas:
 *     Listing:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         pricePerNight:
 *           type: number
 *         location:
 *           type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         maxGuests:
 *           type: number
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *         ownerId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     CreateListingInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - pricePerNight
 *         - location
 *         - maxGuests
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         pricePerNight:
 *           type: number
 *         location:
 *           type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *         maxGuests:
 *           type: number
 *         photos:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /listings:
 *   post:
 *     summary: Create a new listing (Host only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateListingInput'
 *     responses:
 *       200:
 *         description: Listing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Only hosts can create listings
 *       500:
 *         description: Failed to create listing
 */
export const createListing = async (req: Request, res: Response) => {
    try {
        const { title, description, pricePerNight, location, amenities, category, maxGuests, photos } = req.body;
        const ownerId = (req as any).user.id; // Assuming user ID is stored in request object
        const createListingInput = {
            title,
            description,
            pricePerNight,
            location,
            ownerId,
            amenities,
            maxGuests,
            category,
            photos
        };
        const listing = await listingService.createListing(
            createListingInput
        )

        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: "Failed to create listing" });
    }
};

/**
 * @swagger
 * /listings:
 *   get:
 *     summary: Get all listings with optional filtering
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per night
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per night
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location to search in
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: List of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Failed to fetch listings
 */
export const getListings = async (req: Request, res: Response) => {
    try {
        const { minPrice, maxPrice, location, skip = 0, take = 10 } = req.query;

        const listings = await listingService.getListings({
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            location: location ? String(location) : undefined,
            skip: Number(skip),
            take: Number(take)
        });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listings" });
    }
};

/**
 * @swagger
 * /listings/{id}:
 *   get:
 *     summary: Get a listing by ID
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Failed to fetch listing
 */
export const getListingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const listing = await listingService.getListingById(id)

        if (!listing) return res.status(404).json({ error: "Listing not found" });

        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch listing" });
    }
};

/**
 * @swagger
 * /listings/{id}:
 *   put:
 *     summary: Update a listing (Owner only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateListingInput'
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listing'
 *       403:
 *         description: Not authorized to update this listing
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Failed to update listing
 */
export const updateListing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        const updateData = req.body;

        const updated = await listingService.updateListing(
            id,
            userId,
            updateData
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Failed to update listing" });
    }
};

/**
 * @swagger
 * /listings/{id}:
 *   delete:
 *     summary: Delete a listing (Owner only)
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Listing ID
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Not authorized to delete this listing
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Failed to delete listing
 */
export const deleteListing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;
        await listingService.deleteListing(id, userId);

        res.json({ message: "Listing deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete listing" });
    }
};

/**
 * @swagger
 * /listings/filter:
 *   get:
 *     summary: Filter listings with advanced options
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price per night
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price per night
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location to search in
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category to filter by
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Comma-separated list of amenities
 *       - in: query
 *         name: guests
 *         schema:
 *           type: integer
 *         description: Minimum number of guests the listing should accommodate
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items to return
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Filtered list of listings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Listing'
 *       500:
 *         description: Failed to filter listings
 */
export const filterListings = async (req: Request, res: Response) => {
    try {
        const {
            minPrice,
            maxPrice,
            location,
            category,
            amenities,
            guests,
            skip = 0,
            take = 10,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;

        const listings = await listingService.filterListings(
            {
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                location: location ? String(location) : undefined,
                category: category ? String(category) : undefined,
                amenities: amenities ? String(amenities).split(",") : undefined,
                guests: guests ? Number(guests) : undefined,
                sortBy: String(sortBy),
                sortOrder: order === "asc" ? "asc" : "desc",
                skip: Number(skip),
                take: Number(take)
            }
        )

        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: "Failed to filter listings" });
    }
};

