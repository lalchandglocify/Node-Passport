const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Campaign = require('../models/Campaign');


// campaigns
router.get('/', ensureAuthenticated, async(req, res) =>

  res.render('campaigns', {

    user: req.user,campaign:await Campaign.find({})

  })
);

router.get('/add-new', ensureAuthenticated, (req, res) =>
  res.render('add_campaigns', {
    user: req.user
  })
);


  router.post('/add-new',ensureAuthenticated, async(req, res) => {
    user =  req.user;
   
//const campaigns = await Campaign.find({});
    
//console.log(campaigns);
    
  const { name,leads,connected,closed,tottal_sales } = req.body;
  let errors = [];

  if (!name || !leads || !connected || !closed || !tottal_sales) {
    errors.push({ msg: 'Please enter all fields' });
  }


  if (errors.length > 0) {
    res.render('add_campaigns', {
      errors,
      name
    });
  } else {
    const  user_id = user._id;
    const newCampaign = new Campaign({
          name,user_id,leads,connected,closed,tottal_sales
        });


              newCampaign.save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'campaign Added'
                );
                res.redirect('/campaigns/add-new');
              })
              .catch(err => console.log(err));
}

});




module.exports = router;
