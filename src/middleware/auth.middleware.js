import admin from 'firebase-admin';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. check if header exists AND starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Authorization header missing or malformed.' });
  }

  // 2. extract the token
  const idToken = authHeader.split(' ')[1];

  // 3. Ensure token is actually present after the split
  if (!idToken) {
    return res.status(401).json({ message: 'Bearer token missing.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // attach the decoded user information to the request object
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    // return 401 for authentication failures
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};