
async function createAccount(req) {
  try {
    const { firstName, lastName, email, phone, password, accountType, balance } = req;

    if (!firstName || !lastName || !email || !phone || !password || !accountType || !balance) {
      printjson({ error: 'Missing required fields' });
      return;
    }

    const createAcc = db.getCollection('<YOUR_COLLECTION_NAME>').insertOne({
      firstName,
      lastName,
      email,
      phone,
      password,
      accounts: [
        {
          accountNumber: '11111',
          accountType,
          balance: 0
        }
      ]
    });

    printjson({ success: true, createAcc });
  } catch (error) {
    printjson({ error: 'Failed to create account' });
  }
}

// Example usage
createAccount({
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "1234567890",
  password: "securepassword",
  accountType: "savings",
  balance: 1000
});
