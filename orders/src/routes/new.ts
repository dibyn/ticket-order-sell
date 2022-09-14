import mongoose from "mongoose";
import { Ticket } from "../Models/ticket";
import { Order } from "../Models/order";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validationRequest,
} from "@suffix-ticketing/commonfn";
import { body } from "express-validator";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const router = express.Router();
router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .withMessage("TicketId must be provided")
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // make sure the ticket is not already reserved
    // run query to look at all orders, find an order where the ticket
    //  is the ticket we just found and the orders status is not cancelled
    // if we find an order from the means the ticket is reserved
    // const existingOrder = await Order.findOne({
    //   ticket,
    //   status: { // $ = operator
    //     $in: [
    //       OrderStatus.Created,
    //       OrderStatus.AwaitingPayment,
    //       OrderStatus.Complete
    //     ]
    //   }
    // }) ---> written inside model
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    // calculate the expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    // publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });
    res.status(201).send(order);
  }
);
export { router as newOrderRouter };
