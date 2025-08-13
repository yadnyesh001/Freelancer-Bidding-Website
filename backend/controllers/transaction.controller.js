import User from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

export const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const transactions = await Transaction.find({
      $or: [{ client: userId }, { freelancer: userId }]
    })
    .populate('client', 'name email')
    .populate('freelancer', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addFunds = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Amount must be positive" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wallet += amount;
    await user.save();

    await Transaction.create({
      client: user._id,
      freelancer: user._id,
      amount,
      type: "deposit",
      description: "Manual wallet top-up",
    });

    res.status(200).json({ message: "Funds added", wallet: user.wallet });
  } catch (err) {
    console.error("Add Funds Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const payFreelancer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { freelancerId, amount } = req.body;

    if (!freelancerId || !amount || amount <= 0)
      return res.status(400).json({ message: "Missing or invalid data" });

    const client = await User.findById(userId);
    const freelancer = await User.findById(freelancerId);

    if (!client || !freelancer) {
      return res
      .status(404)
      .json({ message: "Client or freelancer not found" });
    }

    if (client.wallet < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    if (freelancerId === userId.toString()) {
      return res.status(400).json({ message: "Cannot pay yourself" });
    }

    client.wallet -= amount;
    freelancer.wallet += amount;

    await client.save();
    await freelancer.save();

    await Transaction.create({
      client: client._id,
      freelancer: freelancer._id,
      amount,
      type: "payment",
      description: "Project payment",
    });

    res
      .status(200)
      .json({ message: "Payment successful", clientWallet: client.wallet });
  } catch (err) {
    console.error("Pay Freelancer Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};