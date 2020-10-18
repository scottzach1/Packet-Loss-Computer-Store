import express, {Request, Response} from 'express';
import passport from "passport";
import {User} from "../models/userModel";
import {getCart} from "../controller/shopCartController";
import {getAllOrderItems, getAllOrders, makeOrder} from "../controller/shopOrderController";

const router = express.Router();

router.post('/create', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
  const {_id}: any = req.user;

  try {
    // User authenticated, find within MongoDB.
    const user = await User.findById(_id);
    if (!user) throw `Could not find user!`;

    // User found, obtain cart.
    const cart = await getCart(user);
    if (!cart) throw `Failed to obtain cart for user`;

    // Add item to cart.
    const order = await makeOrder(user, cart);
    if (!order) throw `Failed to create order, id's don't match.`

    // Success
    return res
      .status(200)
      .json({order, cart})
      .send();
  } catch (e) {
    // Failure
    return res
      .status(400)
      .json({errors: [e]})
      .send();
  }
});

router.post('/get', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
  const {_id}: any = req.user;

  try {
    // User authenticated, find within MongoDB.
    const user = await User.findById(_id);
    if (!user) throw `Could not find user!`;

    // Add item to cart.
    const orders = await getAllOrders(user);
    if (!orders) throw `Failed to find orders for user.`

    // Success
    return res
      .status(200)
      .json({orders})
      .send();
  } catch (e) {
    // Failure
    return res
      .status(400)
      .json({errors: [e]})
      .send();
  }
});

router.post('/get/all/details', [passport.authenticate("jwt", {session: false})], async (req: Request, res: Response) => {
  const {_id}: any = req.user;

  try {
    // User authenticated, find within MongoDB.
    const user = await User.findById(_id);
    if (!user) throw `Could not find user!`;

    // Get orders for user.
    const orderDetails = await getAllOrders(user);
    if (!orderDetails) throw `Failed to find orders for user.`

    // Map these orders into details.
    const orders = await getAllOrderItems(orderDetails);
    if (!orders) throw 'Failed to obtain details for all orders';

    // Success
    return res
      .status(200)
      .json({orders})
      .send();
  } catch (e) {
    // Failure
    return res
      .status(400)
      .json({errors: [e]})
      .send();
  }
});
export {router as orderServerRouter};
