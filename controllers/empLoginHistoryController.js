import EmpLoginHistoryModel from "../models/empLoginHistoryModel.js";

export async function logsLogin(req, employeeId, typ) {

  // Step 1: Insert new login
  const ua = req.useragent || {};
  const result = await EmpLoginHistoryModel.create({ 
    employeeId:employeeId,
    loginType: typ,
    userAgent : {
          device: ua.isMobile ? 'Mobile' : ua.isTablet ? 'Tablet' : 'Desktop',
          platform: ua.platform,
          os: ua.os,
          browser: ua.browser,
          browserVersion: ua.version,
          ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.connection.remoteAddress
    }
  });
  if(!result)
  {
    console.log(`${employeeId} - Login History Not Created`)
  }



  // Step 2: Fetch IDs of all logins, sorted by newest first
  /*
  const recentLogins = await EmpLoginHistoryModel
    .find({ employeeId })
    .sort({ loginAt: -1 }) // newest first
    .skip(5) // skip the 5 most recent
    .select('_id');
  */


  // Step 3: Delete all older logins beyond the latest 5
  /*
  if (recentLogins.length > 0) {
    const idsToDelete = recentLogins.map(doc => doc._id);
    await EmpLoginHistoryModel.deleteMany({ _id: { $in: idsToDelete } });
  }
  */
}
