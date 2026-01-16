// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// In-memory data for demo (resets on restart)
let state = {
    users: [],
    bags: [
        { id: 'BAG-101', seller: 'Farmer Rahim', qty: 10, price: 1000 },
        { id: 'BAG-102', seller: 'Farmer Karim', qty: 25, price: 2500 }
    ],
    transactions: [],
    adminMargin: 25 // 25% Profit Margin
};

// 1. Register API
app.post('/api/register', (req, res) => {
    const { name } = req.body;
    const userId = `LEAF-${Math.floor(1000 + Math.random() * 9000)}`;
    const password = "pass" + Math.floor(100 + Math.random() * 899);
    
    const newUser = { userId, password, name, balance: 0 };
    state.users.push(newUser);
    res.json(newUser);
});

// 2. Buy API (bKash Flow)
app.post('/api/buy', (req, res) => {
    const { bagId } = req.body;
    const index = state.bags.findIndex(b => b.id === bagId);
    
    if (index !== -1) {
        const bag = state.bags[index];
        const adminCut = bag.price * (state.adminMargin / 100);
        const farmerProfit = bag.price - adminCut;
        
        state.transactions.push({
            trxId: 'BK-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
            total: bag.price,
            farmerProfit
        });
        state.bags.splice(index, 1);
        res.json({ success: true, farmerProfit });
    }
});

app.get('/api/data', (req, res) => res.json(state));

// Use Dynamic Port for Cloud Deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Cash Chonkers live on port ${PORT}`));