import UpdateHistoryModel from "../models/empUpdateHistoryModel.js";

export async function logsUpdate(req, employeeId, updateType) {

  // Step 1: Insert new updates
  const ua = req.useragent || {};
  const result = await UpdateHistoryModel.create({ 
    employeeId:employeeId, 
    updateType:updateType, 
    userAgent : {
          at: new Date(),
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
    console.log(`${employeeId} - ${updateType} History Not Created`)
  }

  // Step 2: Fetch IDs of all updates, sorted by newest first
  /*
  const recentUpdates = await UpdateHistoryModel
    .find({ employeeId })
    .sort({ loginAt: -1 }) // newest first
    .skip(50) // skip the most recent
    .select('_id');
  */

  // Step 3: Delete all older update beyond the latest 
  /*
  if (recentUpdates.length > 0) {
    const idsToDelete = recentUpdates.map(doc => doc._id);
    await UpdateHistoryModel.deleteMany({ _id: { $in: idsToDelete } });
  }
  */
}
