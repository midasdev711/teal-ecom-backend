const stripe = require('stripe')('sk_test_51HgtN8LFHugrMBk2qLdqsPiJVe7OZ2Me5dTXUDR0dDi6YA8EDV5QGXjgn3vQmb7qERZSViP1s3slfH4kogB89gkp0038yEz0sE');


async function stripepay(req, res) {
  try {
    // const { amount, source, receipt_email } = req.body

    // const charge = await stripe.charges.create({
    //     amount: 20000,
    //     currency: "usd",
    //     source: "tok_mastercard", // obtained with Stripe.js
    //     metadata: {'order_id': '6735'}
    //   });

    // const charge = await stripe.accounts.create({
    //   type: 'express',
    // });

    const charge = await stripe.accounts.create({
        country: 'US',
        type: 'custom',
        capabilities: {
          card_payments: {
            requested: true,
          },
          transfers: {
            requested: true,
          },
        },
      });

    // const paymentIntent = await stripe.paymentIntents.create({
    //     amount: 1000,
    //     currency: 'inr',
    //     payment_method_types: ['card'],
    //     transfer_group: '6735',
    //   });
      
    //   // Create a Transfer to the connected account (later):
    //   const transfer = await stripe.transfers.create({
    //     amount: 700,
    //     currency: 'inr',
    //     destination: 'acct_1HiCpnGRX8shwi8g',
    //     transfer_group: '6735',
    //   });
      
    // Create a second Transfer to another connected account (later):
      // const secondTransfer = await stripe.transfers.create({
      //   amount: 2000,
      //   currency: 'inr',
      //   destination: '{{OTHER_CONNECTED_STRIPE_ACCOUNT_ID}}',
      //   transfer_group: '{ORDER10}',
      // });


    if (!charge) throw new Error('charge unsuccessful')

    res.status(200).json({
      message: 'charge posted successfully',
      charge
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = stripepay