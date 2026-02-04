import Transaction from "../Schema/TransactionSchema.js";

const transactionController = {
  // Insert Transaction into Database Mainly for Manual Entry by User
  /* 
     Route:
     POST /api/transactions
     Headers: Authorization: Bearer <token>
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

  // Insert Bulk Transactions into Database Mainly for Insertion by AI
  /*
     Route:
     POST /api/transactions/bulk
     Headers: Authorization: Bearer <token>
     Request Body -
        {
          "transactions": [
            {
              "type": "income",
              "amount": 1000,
              "category": "Family",
              "description": "Received money from mom",
              "paymentMethod": null
            },
            {
              "type": "expense",
              "amount": 200,
              "category": "Food",
              "description": "Ate pizza",
              "paymentMethod": null
            }
          ]
       }
  */
  insertBulkTransactions: async (req, res) => {
    const { transactions } = req.body;
    // Getting User Id From JWT
    const user = req.user;
    try {
      // Adding User Id to Every Transaction
      const newTransactions = transactions.map((t) => ({
        ...t,
        userId: user.id,
        date: Date.now(),
      }));

      // Inserting Transactions into Database
      const saveTransactions = await Transaction.insertMany(newTransactions);

      res.status(201).json({
        message: "Successfully Added The New Transactions",
        count: saveTransactions.length,
        transactions: saveTransactions,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  // Fetch All Transactions
  fetchAllTransactions: async (req, res) => {
    // Getting User Id From JWT
    const user = req.user;
    try {
      const allTransactions = await Transaction.find({ userId: user.id });
      res.status(200).json(allTransactions);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
};

export default transactionController;
