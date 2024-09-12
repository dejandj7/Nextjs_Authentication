import nextConnect from 'next-connect';

export function authentication(req, res, next) {
  console.debug('authentication.js')
  if (req.session) {
    console.log(req.session);
    req.user = req.session.userId;
    return next();
  }
  return next();
}

const middleware = nextConnect();

middleware.use(authentication);

export default authentication;