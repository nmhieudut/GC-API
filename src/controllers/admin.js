export const AdminController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find({});
      res.json({ users });
    } catch (e) {
      next(e);
    }
  },
  getUserById: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      res.json({ user });
    } catch (e) {
      next(e);
    }
  },
  updateUserById: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findByIdAndUpdate(userId, ...req.body, {
        new: true
      });
      res.json({ user });
    } catch (e) {
      next(e);
    }
  },
  deleteUserById: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const user = await User.findByIdAndDelete(userId);
      res.json({ user });
    } catch (e) {
      next(e);
    }
  },
  getCampaigns: async (req, res, next) => {
    try {
      const campaigns = await Campaign.find({});
      res.json({ campaigns });
    } catch (e) {
      next(e);
    }
  },
  getCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findById(campaignId);
      res.json({ campaign });
    } catch (e) {
      next(e);
    }
  },
  updateCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        ...req.body,
        { new: true }
      );
      res.json({ campaign });
    } catch (e) {
      next(e);
    }
  },
  deleteCampaignById: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const campaign = await Campaign.findByIdAndDelete(campaignId);
      res.json({ campaign });
    } catch (e) {
      next(e);
    }
  },
  activeOne: async (req, res, next) => {
    const { role } = req.user;
    const { campaignId } = req.params;
    if (role !== 'admin') {
      const err = new Error(responseErrorMessage.FORBIDDEN);
      err.statusCode = 403;
      return next(err);
    }
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { status: 'active' },
        { new: true, runValidator: true }
      );
      res.json({ campaign });
    } catch (e) {
      next(e);
    }
  },
  getDonations: async (req, res, next) => {
    const donations = await Donation.find({});
    res.json({ donations });
  },
  getDonationsByUserId: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const donations = await Donation.find({ donator: userId });
      res.json({ donations });
    } catch (e) {
      next(e);
    }
  },
  getDonationsByCampaignId: async (req, res, next) => {
    const { campaignId } = req.params;
    try {
      const donations = await Donation.find({ campaignId });
      res.json({ donations });
    } catch (e) {
      next(e);
    }
  },
  getTransactions: async (req, res, next) => {}
};
