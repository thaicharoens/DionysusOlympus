module.exports = async function (req, res, proceed) {
    //@TODO Temp disable this policy, allow all
    return proceed();
    //this check ensures if the APPSMITH_KEY is missing from ENV we reject
    if (process.env.APPSMITH_KEY && req.headers['x-api-key'] === process.env.APPSMITH_KEY) {
        return proceed();
    } else {
        return res.forbidden();
    }
  };