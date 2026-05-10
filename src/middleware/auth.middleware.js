import admin from 'firebase-admin';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. checks if header exists AND starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Authorization header missing or malformed.' });
  }

  // 2. extract the token
  const idToken = authHeader.split(' ')[1];

  // 3. ensure token is actually present after the split
  if (!idToken) {
    return res.status(401).json({ message: 'Bearer token missing.' });
  }

  try {
    // 4. verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken, true);
    // 5. attach decoded token to request object for downstream use
    req.user = decodedToken;
    // 6. proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification failed:', error.code, error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
