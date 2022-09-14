import React, { memo, useEffect, useState } from "react";
import Router from 'next/router'
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";

const OrderShow = memo(({ order = {}, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });
  if (timeLeft < 0) return <div>Order Expired</div>;
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51LgtnrIkrq2UDsRktk1gwXGFWEfoL72JDxC0dm33Q8OHrnO6iYNL1WutQAZIc4rz2CyWZLCobDLFEJEvFtfVnnUW00bCbq5LBY"
        amount={order.ticket.price * 100} // default cents // convert to cents
        email={currentUser.email}
      />
      {errors}
    </div>
  );
});
OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return {
    order: data,
  };
};
export default OrderShow;
