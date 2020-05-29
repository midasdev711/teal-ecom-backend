
const ShoppingCartSchema = require('../../models/shopping_cart');
const ShoppingCartDetailSchema = require('../../models/shopping_cart_detail');
const ProductSchema = require('../../models/products');
const OrderSchema   = require('../../models/order');
const VariantsSchema = require('../../models/product_variants');
const { VariantsType } = require('../types/product_variant_constant');
const { ShoppingCartDetailsType } = require('../types/shopping_cart_details_constant');
const { ShoppingCartType } = require('../types/shopping_cart_constant');
const { OrderType } = require('../types/order_constant');
const { MerchantType } = require('../types/merchant_constant');
const { GraphQLInt,GraphQLID,GraphQLList , GraphQLString,GraphQLBoolean ,GraphQLError} = require('graphql');
const { GraphQLEmail } = require('graphql-custom-types');
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json');
const randtoken = require('rand-token');
const axios = require('axios');
const Bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const nodemailer = require('nodemailer');
const emailTemplates = require('email-templates');
const {BASE_URL ,EmailCredentials ,STRIPE_KEY , NMI_KEY , NMI_MERCHAT_URL,AUTHORIZE_NAME,AUTHORIZE_TRANSACTION_KEY } = require("../../constant");
const stripe = require('stripe')(STRIPE_KEY);
const querystring = require('querystring');
const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
const constants = require('../../authorizeConstant');
const { verifyToken } = require('../middleware/middleware');

/**
    * Creating shooping cart
    * checks for existing card or create new one with order id null
    * @param {$CartItems} Name
    * @param {$UserID}  Description
    * @param {$TotalCartItem} Name
    * @returns {$cartDetails Array}
    */


// const CreateShoppingCart = {
//   type : ShoppingCartDetailsType,
//   args : {
//       CartItems : {type : GraphQLJSON },
//       UserID: { type: GraphQLString },
//       TotalCartItem: { type: GraphQLInt }
//   },
//   resolve: async (parent, args ) => {

//      let totalCartPrice = 0;
//       let userShoppingCard = await ShoppingCartSchema.find({ UserId: args.UserID ,OrderId : null });
//        if(userShoppingCard.length > 0)
//        {
//          let existingShoppingCard = await ShoppingCartDetailSchema.find({ ShoppingCartId: userShoppingCard[0]._id });

//          let promises = args.CartItems.map(async (item,index) => {
//             const product = await ProductSchema.find({ _id: item._id});
//             args.CartItems[index].ProductSalePrice = product[0].ProductSalePrice;
//             args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * product[0].ProductSalePrice;
//             totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice*item.ProductTotalQuantity)
//             return product
//          });

//          await Promise.all(promises);

//          if(existingShoppingCard.length > 0 )
//          {
//            let updatedShoppingCard  = await ShoppingCartDetailSchema.findOneAndUpdate(
//                { ShoppingCartId: userShoppingCard[0]._id },
//                { $set: {Products: args.CartItems,  ItemTotalPrice : totalCartPrice , TotalCartItem : args.TotalCartItem } } ,
//                { new: true}
//             );
//            return updatedShoppingCard;
//          }
//          else
//          {
//            let ShoppingCartAddDetailsConstant = new ShoppingCartDetailSchema({
//                Products: args.CartItems,
//                ShoppingCartId : userShoppingCard[0]._id,
//                ItemTotalPrice : totalCartPrice ,
//                TotalCartItem : args.TotalCartItem
//            });

//            let shoppingCarDetails = await ShoppingCartAddDetailsConstant.save();

//            return shoppingCarDetails;
//          }
//        }
//       else
//       {
//         let ShoppingCartCreateConstant = new ShoppingCartSchema({
//               UserId :args.UserID,
//               OrderId :null
//         });
//         let shoppingCartID = await ShoppingCartCreateConstant.save();

//         let promises = args.CartItems.map(async (item,index) => {
//            const product = await ProductSchema.find({ _id: item._id});
//            totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice * item.ProductTotalQuantity);
//            args.CartItems[index].ProductSalePrice = product[0].ProductSalePrice;
//            args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * product[0].ProductSalePrice;
//            return product
//        });

//         await Promise.all(promises);

//         let ShoppingCartAddDetailsConstant = new ShoppingCartDetailSchema({
//             Products: args.CartItems,
//             ShoppingCartId : shoppingCartID._id,
//             ItemTotalPrice : totalCartPrice ,
//             TotalCartItem : args.TotalCartItem
//         });

//         let shoppingCarDetails = await ShoppingCartAddDetailsConstant.save();

//         return shoppingCarDetails;
//       }
//     }
// };


const CreateShoppingCart = {
  type : ShoppingCartDetailsType,
  args : {
      CartItems : {type : GraphQLJSON },
      UserID: { type: GraphQLString },
      TotalCartItem: { type: GraphQLInt }
  },
  resolve: async (parent, args, context) => {
    const id = await verifyToken(context);
       
     let totalCartPrice = 0;
      let userShoppingCard = await ShoppingCartSchema.find({ UserId: args.UserID ,OrderId : null });
       if(userShoppingCard.length > 0)
       {
         let existingShoppingCard = await ShoppingCartDetailSchema.find({ ShoppingCartId: userShoppingCard[0]._id });

         let promises = args.CartItems.map(async (item,index) => {
            if(item.selectedVariant === undefined)
             {
                const product = await ProductSchema.find({ _id: item._id});
                args.CartItems[index].ProductSalePrice = product[0].ProductSalePrice;
                args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * product[0].ProductSalePrice;
                totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice*item.ProductTotalQuantity)
                return product
             }
             else
             {
                const productVariant = await VariantsSchema.find({ _id: item.selectedVariant._id});
                totalCartPrice  = totalCartPrice + (productVariant[0].SellingPrice * item.ProductTotalQuantity);
                args.CartItems[index].ProductVariantID = productVariant[0]._id;
                args.CartItems[index].ProductSalePrice = productVariant[0].SellingPrice;
                args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * productVariant[0].SellingPrice;
                return productVariant
             }
         });

         await Promise.all(promises);

         if(existingShoppingCard.length > 0 )
         {
           let updatedShoppingCard  = await ShoppingCartDetailSchema.findOneAndUpdate(
               { ShoppingCartId: userShoppingCard[0]._id },
               { $set: {Products: args.CartItems,  ItemTotalPrice : totalCartPrice , TotalCartItem : args.TotalCartItem } } ,
               { new: true}
            );
           return updatedShoppingCard;
         }
         else
         {
           let ShoppingCartAddDetailsConstant = new ShoppingCartDetailSchema({
               Products: args.CartItems,
               ShoppingCartId : userShoppingCard[0]._id,
               ItemTotalPrice : totalCartPrice ,
               TotalCartItem : args.TotalCartItem
           });

           let shoppingCarDetails = await ShoppingCartAddDetailsConstant.save();

           return shoppingCarDetails;
         }
       }
      else
      {
        let ShoppingCartCreateConstant = new ShoppingCartSchema({
              UserId :args.UserID,
              OrderId :null
        });
        let shoppingCartID = await ShoppingCartCreateConstant.save();

        let promises = args.CartItems.map(async (item,index) => {
          if(item.selectedVariant === undefined)
          {
             const product = await ProductSchema.find({ _id: item._id});
             args.CartItems[index].ProductSalePrice = product[0].ProductSalePrice;
             args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * product[0].ProductSalePrice;
             totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice*item.ProductTotalQuantity)
             return product
          }
          else
          {
             const productVariant = await VariantsSchema.find({ _id: item.selectedVariant._id});
             totalCartPrice  = totalCartPrice + (productVariant[0].SellingPrice * item.ProductTotalQuantity);
             args.CartItems[index].ProductVariantID = productVariant[0]._id;
             args.CartItems[index].ProductSalePrice = productVariant[0].SellingPrice;
             args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * productVariant[0].SellingPrice;
             return productVariant
          }
       });

        await Promise.all(promises);

        let ShoppingCartAddDetailsConstant = new ShoppingCartDetailSchema({
            Products: args.CartItems,
            ShoppingCartId : shoppingCartID._id,
            ItemTotalPrice : totalCartPrice ,
            TotalCartItem : args.TotalCartItem
        });

        let shoppingCarDetails = await ShoppingCartAddDetailsConstant.save();

        return shoppingCarDetails;
      }
    }
};


/**
    * Updating existing shooping cart
    *checks for existing card or create new one with order id null
    * @param {$CartItems} Name
    * @param {$UserID}  Description
    * @param {$TotalCartItem} Name
    * @returns {$cartDetails Array}
    */


const UpdateShoppingCart = {
  type : ShoppingCartDetailsType,
  args : {
      CartItems : {type : GraphQLJSON },
      UserID: { type: GraphQLString },
      TotalCartItem: { type: GraphQLInt }
  },
  resolve: async (parent, args, context) => {
       const id = await verifyToken(context);
       let totalCartPrice = 0;

       /* checking whether shopping cart has been created or not */

       const userShoppingCard = await ShoppingCartSchema.find({ UserId: args.UserID ,OrderId : null });

       if(userShoppingCard.length > 0)
       {
         const existingShoppingCard = await ShoppingCartDetailSchema.find({ ShoppingCartId: userShoppingCard[0]._id });

          if(existingShoppingCard.length > 0)
          {
            let existingProduct = existingShoppingCard[0].Products;
            let totalCartPrice = existingShoppingCard[0].ItemTotalPrice;
            let totalCartItem  = existingShoppingCard[0].TotalCartItem + args.TotalCartItem;
            let cartProduct = args.CartItems;
            let currentCartProduct = existingProduct;

                const promises = args.CartItems.map(async (obj,index) => {
                    let itemsId = [];
                       itemsId.push(obj._id);
                    let isAlreadyInCart = existingProduct.filter( element => {
                        return itemsId.indexOf(element._id.toString()) !== -1;
                     });
                      if(isAlreadyInCart.length > 0){
                         const product = await ProductSchema.find({ _id: obj._id});
                         totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice * obj.ProductTotalQuantity)
                         currentCartProduct[index].ProductTotalQuantity =  currentCartProduct[index].ProductTotalQuantity + obj.ProductTotalQuantity;
                         currentCartProduct[index].ProductTotalPrice = currentCartProduct[index].ProductTotalQuantity * product[0].ProductSalePrice;
                         currentCartProduct[index].ProductSalePrice = product[0].ProductSalePrice;
                      }else{
                         const product = await ProductSchema.find({ _id: obj._id});
                         totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice * obj.ProductTotalQuantity)
                         obj.ProductTotalPrice = obj.ProductTotalQuantity * product[0].ProductSalePrice;
                         obj.ProductSalePrice = product[0].ProductSalePrice;
                         currentCartProduct.push(obj)
                      }
                   return currentCartProduct
               });

               await Promise.all(promises);

               const updatedShoppingCard  = await ShoppingCartDetailSchema.findOneAndUpdate(
                   { ShoppingCartId: userShoppingCard[0]._id },
                   { $set: { Products: currentCartProduct,  ItemTotalPrice : totalCartPrice , TotalCartItem : totalCartItem } } ,
                   { new: true}
                );

               return updatedShoppingCard;
          }
          else
          {
             /* creating shooping card details */

             const promises = args.CartItems.map(async (item,index) => {
                const product = await ProductSchema.find({ _id: item._id});
                totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice * item.ProductTotalQuantity);
                args.CartItems[index].ProductSalePrice = product[0].ProductSalePrice;
                args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * product[0].ProductSalePrice;
                return product
            });

             await Promise.all(promises);

             let ShoppingCartAddDetailsConstant = new ShoppingCartDetailSchema({
                 Products: args.CartItems,
                 ShoppingCartId : userShoppingCard[0]._id,
                 ItemTotalPrice : totalCartPrice ,
                 TotalCartItem : args.TotalCartItem
             });

             let shoppingCarDetails = await ShoppingCartAddDetailsConstant.save();

             return shoppingCarDetails;
          }
       }
      else
      {
           /* creating shopping cart */

          let ShoppingCartCreateConstant = new ShoppingCartSchema({
                UserId :args.UserID,
                OrderId :null
          });
          let shoppingCartID = await ShoppingCartCreateConstant.save();

          const promises = args.CartItems.map(async (item,index) => {
             const product = await ProductSchema.find({ _id: item._id});
             totalCartPrice  = totalCartPrice + (product[0].ProductSalePrice * item.ProductTotalQuantity);
             args.CartItems[index].ProductSalePrice = product[0].ProductSalePrice;
             args.CartItems[index].ProductTotalPrice = args.CartItems[index].ProductTotalQuantity * product[0].ProductSalePrice;
             return product
         });

          await Promise.all(promises);

          let ShoppingCartAddDetailsConstant = new ShoppingCartDetailSchema({
              Products: args.CartItems,
              ShoppingCartId : shoppingCartID._id,
              ItemTotalPrice : totalCartPrice ,
              TotalCartItem : args.TotalCartItem
          });

          let shoppingCarDetails = await ShoppingCartAddDetailsConstant.save();

          return shoppingCarDetails;
      }
    }
};


/**
    * cancel a particualr item from a order by user
    * @param {$OrderID} Name
    * @param {$UserID}  UserID
    * @param {$ProductID} ProductID
    * @returns {$cartDetails Array}
    */

 const CancelOrderByUser = {
      type: OrderType,
      args : {
          OrderID : {type : GraphQLString },
          ProductID  : {type : GraphQLString },
          UserID: { type: GraphQLString }
      },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);
        const order = await OrderSchema.find({ _id: args.OrderID , UserId : args.UserID });

          if(order.length > 0)
          {
            let cancelledItemTotalPrice = 0 ;

            const promises = order[0].Products.map(async (item ,index) => {
                   if(item._id == args.ProductID)
                   {
                     cancelledItemTotalPrice  = item.ProductTotalPrice;
                   }
             });

            await Promise.all(promises);

            let newOrderAmount = order[0].OrderAmount - cancelledItemTotalPrice ;

            const order_updates  = await OrderSchema.findOneAndUpdate(
                { _id: args.OrderID , "Products._id" : args.ProductID},
                { $set: {"Products.$.Status" : 0  , OrderAmount : newOrderAmount } } ,
                { new: true }
             );
            return order_updates ;

          }else{
              throw new Error('Order is not valid');
          }

      }
    };


    /**
        * cancel whole order by user
        * @param {$OrderID} Name
        * @param {$UserID}  UserID
        * @returns {$cartDetails Array}
        */

    const CancelWholeOrderByUser = {
        type: OrderType,
        args : {
            OrderID : {type : GraphQLString },
            UserID: { type: GraphQLString }
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
          const order = await OrderSchema.find({ _id: args.OrderID , UserId : args.UserID });
            if(order.length > 0)
            {
              const order_updates  = await OrderSchema.findOneAndUpdate(
                  { _id: args.OrderID  },
                  { $set: { "Products.$[elem].Status": 0 ,Status : 0 } } ,
                  { arrayFilters: [{ "elem.Status": 1 }], "multi": true }
               );
              return order_updates ;

            }else{
                throw new Error('Order is not valid');
            }

        }
      };


  /**
      * cancel order by the merchant
      * @param {$OrderID} Name
      * @param {$ProductID}  UserID
      * @returns {$cartDetails Array}
      */

  const CancelOrderByMerchant = {
     type: new GraphQLList(OrderType),
     type : OrderType,
     args : {
         OrderID : {type : GraphQLString },
         ProductID: { type: GraphQLString }
     },
     resolve: async (parent, args, context) => {
      const id = await verifyToken(context);

       const order = await OrderSchema.find({ _id: args.OrderID , "Products._id" : args.ProductID });
         if(order.length > 0)
         {
           const order_updates  = await OrderSchema.findOneAndUpdate(
               { _id: args.OrderID , "Products._id" : args.ProductID},
               { $set: {"Products.$.Status" : 0 } } ,
               { new: true }
            );

           return order_updates ;

         }else{
             throw new Error('Order is not valid');
         }

     }
   };

   /**
       * setting up the payment method type in orders
       * @param {$_id} Name
       * @param {$PaymentMethod}  UserID
       * @returns {$orderDetails Array}
       */

   const PaymentMethodMutation = {
       type:MerchantType,
       args: {
           _id: { type: GraphQLString },
           PaymentMethod : { type : GraphQLString},
        },
        resolve: async (parent, args, context) => {
          const id = await verifyToken(context);
           const order = await OrderSchema.find({ _id: args._id});

             if(order.length > 0)
             {
                  const order_updates  = await OrderSchema.findOneAndUpdate(
                      { _id: order[0]._id},
                      { $set: {PaymentMethod :args.payment_type} } ,
                      {new: true}
                   );
                 return order_updates;
             }else{
                 throw new Error('OrderID is not valid');
             }
        }
   };


   /**
       * placing order mutation
       * @param {$_id} Name
       * @param {$PaymentMethod}  UserID
       * @returns {$orderDetails Array}
       */

const PlaceOrderMutation = {
      type : ShoppingCartType,
      args : {
          DeliveryAddress: { type: GraphQLJSONObject },
          ShippingAddress : {type: GraphQLJSONObject },
          CardDetails : {type: GraphQLJSONObject },
          UserID: { type: GraphQLString },
          PaymentType:{type: GraphQLString },
          TokenID :{type: GraphQLString },
          ReceiptEmail :{ type: GraphQLEmail }
      },
      resolve: async (parent, args, context) => {
        const id = await verifyToken(context);

        const userShoppingCard = await ShoppingCartSchema.find({ UserId: args.UserID ,OrderId : null });

         if(userShoppingCard.length > 0)
         {
           const existingShoppingCard = await ShoppingCartDetailSchema.find({ ShoppingCartId: userShoppingCard[0]._id });

           if(existingShoppingCard.length > 0)
           {
             let totalCartPrice = parseFloat(existingShoppingCard[0].ItemTotalPrice);
            
             let shippingAddress = {
                   "Name" : args.ShippingAddress.name,
                   "Email" : args.ShippingAddress.email,
                   "Mobile" : args.ShippingAddress.mobile,
                   "PostalCode" : args.ShippingAddress.postal_code,
                   "Address" : args.ShippingAddress.address,
                   "City" : args.ShippingAddress.city,
                   "State" : args.ShippingAddress.state,
                   "Country" : args.ShippingAddress.country,
                   "DeliveryAddressType" : args.ShippingAddress.shipping_address_type
             };

             let deliveryAddress = {
                   "Name" : args.DeliveryAddress.name,
                   "Email" : args.DeliveryAddress.email,
                   "Mobile" : args.DeliveryAddress.mobile,
                   "PostalCode" : args.DeliveryAddress.postal_code,
                   "Address" : args.DeliveryAddress.address,
                   "City" : args.DeliveryAddress.city,
                   "State" : args.DeliveryAddress.state,
                   "Country" : args.DeliveryAddress.country,
                   "DeliveryAddressType" : args.DeliveryAddress.delivery_address_type
             };

             if(args.PaymentType == "Stripe")
               {
                 const charge = await stripe.charges.create({
                                   amount: totalCartPrice,
                                   currency: 'usd',
                                   source: args.TokenID,
                                   receipt_email: args.ReceiptEmail,
                                   description:"Teal Transaction",
                                   shipping: {
                                             name: args.ShippingAddress.name,
                                             address: {
                                               line1: args.ShippingAddress.address,
                                               postal_code:  args.ShippingAddress.postal_code,
                                               city: args.ShippingAddress.city,
                                               state: args.ShippingAddress.state,
                                               country: args.DeliveryAddress.country,
                                               }
                                            }
                                });

                 let AddOrderConstant = new OrderSchema({
                       UserId: args.UserID,
                       Products:existingShoppingCard[0].Products,
                       OrderAmount: charge.amount,
                       ShippingAddress : shippingAddress,
                       DeliveryAddress : deliveryAddress,
                       PaymentMethod: args.PaymentType,
                       TransactionID:charge.id
                  });

                  let NewOrderSaved = await AddOrderConstant.save();

                  const cart_updates  = await ShoppingCartSchema.findOneAndUpdate(
                      { "_id": userShoppingCard[0]._id },
                      { $set: { OrderId :NewOrderSaved._id } } ,
                      { new: true }
                   );

                  return cart_updates ;
               }
              else if(args.PaymentType == "Authorize")
              {
                 function doAuthorizePayment() {
                      return new Promise(resolve => {
                        setTimeout(() => {

                           let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
                               merchantAuthenticationType.setName(AUTHORIZE_NAME);
                               merchantAuthenticationType.setTransactionKey(AUTHORIZE_TRANSACTION_KEY);

                           let creditCard = new ApiContracts.CreditCardType();
                              creditCard.setCardNumber(args.CardDetails.number);
                              creditCard.setExpirationDate(args.CardDetails.expiry);
                              creditCard.setCardCode(args.CardDetails.cvc);

                           let paymentType = new ApiContracts.PaymentType();
                               paymentType.setCreditCard(creditCard);

                           let billTo = new ApiContracts.CustomerAddressType();
                                               billTo.setFirstName(args.ShippingAddress.name);
                                               billTo.setCity(args.ShippingAddress.city);
                                               billTo.setState(args.ShippingAddress.state);
                                               billTo.setZip(args.ShippingAddress.postal_code);
                                               billTo.setCountry(args.DeliveryAddress.country);

                           let transactionRequestType = new ApiContracts.TransactionRequestType();
                               transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
                               transactionRequestType.setPayment(paymentType);
                               transactionRequestType.setAmount(totalCartPrice);
                               transactionRequestType.setBillTo(billTo);

                            let createRequest = new ApiContracts.CreateTransactionRequest();
                               createRequest.setMerchantAuthentication(merchantAuthenticationType);
                               createRequest.setTransactionRequest(transactionRequestType);

                             let ctrl =  new ApiControllers.CreateTransactionController(createRequest.getJSON());

                             let response = ctrl.execute(function(){

                                  let apiResponse = ctrl.getResponse();

                                  let response = new ApiContracts.CreateTransactionResponse(apiResponse);

                                  resolve(response)
                             });
                        }, 2000);

                      });
                    }

                    const response = await doAuthorizePayment();

                    if(response != null)
                       {
                        if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
                        {
                          if(response.getTransactionResponse().getMessages() != null){

                             let authorizeTransactionID = response.getTransactionResponse().getTransId() ;

                             let AddOrderConstant = new OrderSchema({
                                  UserId: args.UserID,
                                  Products:existingShoppingCard[0].Products,
                                  OrderAmount: totalCartPrice,
                                  ShippingAddress : shippingAddress,
                                  DeliveryAddress : deliveryAddress,
                                  PaymentMethod: args.PaymentType,
                                  TransactionID:authorizeTransactionID
                             });

                             let NewOrderSaved = await AddOrderConstant.save();

                             const cart_updates  = await ShoppingCartSchema.findOneAndUpdate(
                                 { "_id": userShoppingCard[0]._id },
                                 { $set: { OrderId :NewOrderSaved._id } } ,
                                 { new: true }
                              );

                             return cart_updates ;

                          }
                          else {
                            if(response.getTransactionResponse().getErrors() != null){

                               throw new Error(response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                            }
                          }
                        }else
                        {
                          if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
                               throw new Error(response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                            } else {
                             throw new Error(response.getMessages().getMessage()[0].getText());
                          }
                        }
                    }
                    else
                    {
                       throw new Error('Failed Transaction. ');
                    }
              }
              else
              {
                 let creditCard = {
                        'type': 'sale',
                        'amount': totalCartPrice,
                        'ccnumber': args.CardDetails.number,
                        'ccexp': args.CardDetails.expiry,
                        'cvv': args.CardDetails.cvc,
                        'shipping_first_name': args.ShippingAddress.name,
                        'shipping_address1': args.ShippingAddress.address,
                        'shipping_city': args.ShippingAddress.city,
                        'shipping_state': args.ShippingAddress.state,
                        'shipping_zip' : args.ShippingAddress.postal_code
                     };
                    creditCard.security_key = NMI_KEY;
                    creditCard = querystring.stringify(creditCard);

                     const config = {
                              headers: {
                                     'Content-Type': 'application/x-www-form-urlencoded' ,
                                     'Content-Length': Buffer.byteLength(creditCard)
                                  }
                             };

                        let paymentResponse = await axios.post(NMI_MERCHAT_URL, creditCard , config);
                              let q = querystring.parse(paymentResponse.data);

                              if(q.responsetext == "DECLINE")
                              {
                                  throw new Error('Failed Transaction. ');
                              }
                              else
                              {
                                   let nmiTransactionID = q.transactionid ;

                                   let AddOrderConstant = new OrderSchema({
                                        UserId: args.UserID,
                                        Products:existingShoppingCard[0].Products,
                                        OrderAmount: totalCartPrice,
                                        ShippingAddress : shippingAddress,
                                        DeliveryAddress : deliveryAddress,
                                        PaymentMethod: args.PaymentType,
                                        TransactionID:nmiTransactionID
                                   });

                                   let NewOrderSaved = await AddOrderConstant.save();

                                   const cart_updates  = await ShoppingCartSchema.findOneAndUpdate(
                                       { "_id": userShoppingCard[0]._id },
                                       { $set: { OrderId :NewOrderSaved._id } } ,
                                       { new: true }
                                    );

                                   return cart_updates ;
                              }
              }
           }
           else
           {
              throw new Error('shiping card details not found');
           }
         }
         else
         {
             throw new Error('shiping card doesnot exits ');
         }
      }
    };

const OrderArray = { CancelOrderByMerchant,PlaceOrderMutation , PaymentMethodMutation , CreateShoppingCart ,UpdateShoppingCart ,
    CancelOrderByUser , CancelWholeOrderByUser , PaymentMethodMutation };

module.exports = OrderArray;
