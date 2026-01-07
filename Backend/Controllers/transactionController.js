import Transaction from "../Schema/TransactionSchema.js";

const transactionController = {
  // Insert Transaction into Database
  /* Headers: Authorization: Bearer <token>
       Request Body -
        {
          "userId" : Comming From JWT Automatically,
          "type" : "imcome" or "expense",
          "amount" : 200,
          "category" : "Food",
          "description" : "Biryani From The Nearby Shop",
          "paymentMethod" : "cash" or "card" or "upi" or "bank", (optional)
        }
    */

  insertTransaction: async (req, res) => {
    //console.log(req.user);
    const { type, amount, category, description, paymentMethod } = req.body;
    // Getting User Id From JWT
    const user = req.user;
    try {
      const newTransaction = new Transaction({
        userId: user.id,
        type,
        amount,
        category,
        description,
        paymentMethod,
        date: Date.now(),
      });
      await newTransaction.save();

      res.status(201).json({
        message: `Successfully Added The New ${newTransaction.type} Transaction`,
        Transaction: {
          id: newTransaction._id,
          userId: user.id,
          amount: amount,
          category: category,
          description: description,
          paymentMethod: paymentMethod,
          date: newTransaction.date,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

export default transactionController;
