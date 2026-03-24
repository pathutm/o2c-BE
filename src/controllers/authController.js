const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const org = await Organization.findOne({ email });
        if (!org) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await org.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            org: {
                id: org.id,
                name: org.name
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, org: { id: org.id, name: org.name, email: org.email } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    login
};
