import admin from 'firebase-admin';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // checks if header exists AND starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Authorization header missing or malformed.' });
  }

  // extract the token
  const idToken = authHeader.split(' ')[1];

  // ensure token is actually present after the split
  if (!idToken) {
    return res.status(401).json({ message: 'Bearer token missing.' });
  }

  try {
    // verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken, true);
    // attach decoded token to request object for downstream use
    req.user = decodedToken;
    // proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification failed:', error.code, error.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
