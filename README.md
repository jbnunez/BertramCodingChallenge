Steps to run program:
install nvm and npm
Install node 19.9.0 - 'nvm install 19.9.0', then 'nvm use 19.9.0'
cd into coffee-ui, run 'npm install'
cd into coffee-server, run 'npm install'
In separate terminals, run 'npm run start' from coffee-ui and coffee-server
Navigate to http://localhost:3000/
Enter your users and start entering orders. 
You may enter the same user multiple times.
This supports ordering multiple items without having to manually add up their prices.
If there are any incomplete or empty rows (no user or zero price), they will simply be ignored

To reset user balances, you can copy the contents of users_no_balance.json into users.json

Explanation of my solution:
It seemed to me like the best way to determine who should pay next was to see who had the biggest gap between what they'd paid and what they'd received.
To track this, whenever someone has coffee without paying, the price of their coffee is deducted from their balance.
When someone pays for the group, the total amount paid is added to their balance and the price of their items is deducted.
Tip and Tax are divided proportionally among each user who had items in the order based on the price of their items.


Areas for future improvements:
-Code Cleanup: I used the npm built in react starter kit, so there may be some extraneous boilerplate code in use
-Error handling: I didn't have time to add much error handling
-Help text: if a user has invalid inputs, show them helpful messages about what data is missing or invalid
-Alignment: I think there's still some odd alignment behavior in the UI, and the spacing and alignment in general could look better if I had more time to work on this.
-Use a proper database, this will enable a lot more features, but for this minimalist version of the app, it's arguably overkill
-Host the app on the web so it isn't reliant on a particular machine running it
-Implements logins
-Allow users to input their orders individually, and identify their group using a code
--One person starts the order, which gives them a code they share with others (perhaps a qr code)
--Each person enters the code, then the prices of their items
-Make user dropdowns searchable so you can start typing the name to narrow the options
-Store transactions to allow users to view their past orders and payments
-Add ability for users to view their current balances
-Create an option to store favorite orders for each user
-Create ability to remove users
