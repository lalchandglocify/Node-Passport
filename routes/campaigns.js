const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Campaign = require('../models/Campaign');
const User = require('../models/User');


// campaigns
router.get('/', ensureAuthenticated, async(req, res) =>

  res.render('campaigns', {

    user: req.user,campaign:await Campaign.find({}).populate('user_id')

  })
);

router.get('/add-new', ensureAuthenticated, (req, res) =>
  res.render('add_campaigns', {
    user: req.user
  })
);


router.get('/view/:id', ensureAuthenticated, async(req, res) => {

var campaign = await Campaign.findById(req.params.id).populate('user_id');
res.render('campaignView', {
    user: req.user,campaign:campaign
  })
})
router.get('/edit/:id', ensureAuthenticated, async(req, res) =>{

var campaign =  await Campaign.findById(req.params.id)

res.render('add_campaigns', {
    user: req.user,campaign:campaign
  })

});


router.get('/delete/:id', ensureAuthenticated, (req, res) =>

Campaign.deleteOne({_id:req.params.id}).then(user => {
                req.flash(
                  'success_msg',
                  'campaign Deleted'
                );
                res.redirect('/campaigns');
              })
              .catch(err => console.log(err))

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

   router.post('/update/:id',ensureAuthenticated, async(req, res) => {
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
    const newCampaign =  Campaign.updateOne({_id:req.params.id},{
          name,user_id,leads,connected,closed,tottal_sales
        }).then(user => {
                req.flash(
                  'success_msg',
                  'campaign Updated'
                );
                res.redirect('back');
              })
              .catch(err => console.log(err));
}

});

router.get('/chat', ensureAuthenticated, async(req, res) =>

  res.render('chat', {

    user: req.user,campaign:await Campaign.find({}).populate('user_id')

  })
);


router.get('/singleChat', ensureAuthenticated, async(req, res) =>

  res.render('singleChat', {

    user: req.user,users:await User.find({_id: {$ne: req.user._id}})

  })
);


module.exports = router;
