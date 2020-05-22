/*
  * Created By : Ankita Solace
  * Created Date : 02-01-2019
  * Purpose : Base 64 image upload on aws
*/


const   UsersPaidSubscriptions = require('../../../models/users_paid_subscriptions');


// check is user is allow to view full content according to subscription date else hide content
async function  calculateSubscribeContent( args,lor ) {
  console.log("here");
  if( typeof lor[0].isPaidSubscription != 'undefined' &&  lor[0].isPaidSubscription ) {
     if(typeof args.UserID != 'undefined' && args.UserID != 0 ) {
         if( await checkUserSubscription( args, lor[0].AuthorID ) <= 0 ) {
            lor[0].Description = lor[0].Description.substring(0, PremiumContentLen)+' <img src="'+SubscribeCdnUrl+'">';
            lor[0].isContentAllowed = false;
         } else  lor[0].isContentAllowed = true;

     } else {
       lor[0].isContentAllowed = false;
       lor[0].Description = lor[0].Description.substring(0, PremiumContentLen)+' <img src="'+SubscribeCdnUrl+'">';
     }
  }
  return await lor;
}

// check vlaues in db for user allowed for subscription or not
  async function  checkUserSubscription( args,AuthorID ) {
      return UsersPaidSubscriptions.findOne({ $and : [{AuthorID : AuthorID },{ Status : { $ne : 0 } },{ UserID : args.UserID },{ EndDate :{ $gte: new Date() }  }]}).countDocuments();
  }

module.exports = { calculateSubscribeContent };
