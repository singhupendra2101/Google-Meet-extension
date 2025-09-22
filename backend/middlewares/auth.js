import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        // Check for token in the Authorization header (e.g., "Bearer TOKEN")
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication failed: No token provided.' });
        }

        // Verify the token using the secret key
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID from the token to the request object
        req.user = { _id: decodedData?.id };

        // Continue to the next middleware or the actual route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired. Please log in again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
        
        res.status(500).json({ message: 'Authentication failed.' });
    }
};